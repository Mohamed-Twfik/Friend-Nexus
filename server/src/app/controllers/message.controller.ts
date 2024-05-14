import messageModel from "../models/message.model";
import { IQueryString } from "../types/apiFeature.type";
import { IMessage } from "../types/message.type";
import { OKResponse } from "../types/response";
import ApiFeature from "../utils/apiFeatures";
import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";
import fs from "fs";
import path from "path";
import io from "../../socket";
import friendShipModel from "../models/friendShip.model";
import { IUserSchema } from "../types/user.type";
import chatUserModel from "../models/chatUser.model";
import { IChatSchema } from "../types/chat.type";
import chatModel from "../models/chat.model";

export const getChatMessages = catchErrors(async (req, res, next) => {
  const chat = req.chat;
  const search = req.query.search as string
  const queryString: IQueryString = {
    page: +(req.query.page as string),
    pageSize: +(req.query.pageSize as string),
    sort: "-createdAt",
    search: search,
  }
  const apiFeature = new ApiFeature(messageModel.find({ chat: chat._id }).populate("user"), queryString, { chat: chat._id })
    .sort()
    .search({
      content: { $regex: search, $options: "i" }
    })
    .paginate();
  const messages = await apiFeature.get();
  const total = await apiFeature.getTotal();

  const response: OKResponse = {
    message: "Success",
    data: {
      results: messages,
      total,
    },
  };
  res.status(200).json(response);
});

export const createMessage = catchErrors(async (req, res, next) => {
  const user = req.authUser;
  const chat = req.chat;
  const { content } = req.body;
  const files = req.files as Express.Multer.File[];
  
  if(!content && files.length === 0) return next(errorMessage(422, "Content or files is required"));
  
  const messageData: IMessage = {
    user: user._id,
    chat: chat._id,
  }
  if (files.length !== 0) messageData.files = files.map(file => file.filename);
  if(content) messageData.content = content;
  const message = await messageModel.create(messageData);

  const data = {
    action: "create",
    data: {
      message,
      chat: chat._id,
    },
  }
  await sendSocketEvent(chat, user, data);

  const response: OKResponse = {
    message: "Success",
    data: message,
  };
  res.status(201).json(response);
});

export const updateMessage = catchErrors(async (req, res, next) => {
  const message = req.message;
  const user = req.authUser;
  const { content } = req.body;
  const files = req.files as Express.Multer.File[];

  message.content = content || message.content;
  if (files && files.length !== 0) {
    if (message.files && message.files.length !== 0) {
      message.files.forEach((file: string) => {
        const fileURL = path.join("uploads", file);
        fs.unlink(fileURL, (err) => {
          if (err) console.log(err);
        });
      });
    }
    message.files = files.map(file => file.filename);
  }
  await message.save();

  const data = {
    action: "update",
    data: message
  };
  const chat = await chatModel.findById(message.chat) as IChatSchema;
  await sendSocketEvent(chat, user, data);

  const response: OKResponse = {
    message: "Success",
    data: message,
  };
  res.status(202).json(response);
});

export const deleteMessage = catchErrors(async (req, res, next) => {
  const message = req.message;
  const user = req.authUser;
  const chat = req.chat;

  if (message.files.length !== 0) {
    message.files.forEach((file: string) => {
      const fileURL = path.join("uploads", file);
      fs.unlink(fileURL, (err) => {
        if (err) console.log(err);
      });
    });
  };

  await message.deleteOne();

  const data = {
    action: "delete",
    data: {
      message,
      chat: chat._id,
    },
  }
  await sendSocketEvent(chat, user, data);

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});

const sendSocketEvent = async (chat: IChatSchema, user: IUserSchema, data: {action: string, data: object}) => {
  if (chat.friendShip) {
    const friendShip = await friendShipModel.findById(chat.friendShip).populate("user1").populate("user2");
    const friend = (friendShip?.user1._id.toString() === user._id.toString()) ? friendShip?.user2 : friendShip?.user1;
    io.getIO().in((friend as IUserSchema).socketId as string).emit("message", data);
  } else {
    const users = await chatUserModel.find({ chat: chat._id }).populate("user");
    users.forEach((chatUser) => {
      io.getIO().in((chatUser.user as IUserSchema).socketId as string).emit("message", data);
    });
  }
}