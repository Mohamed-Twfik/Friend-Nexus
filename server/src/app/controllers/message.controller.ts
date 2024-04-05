import messageModel from "../models/message.model";
import { IQueryString } from "../types/apiFeature.type";
import { IMessage } from "../types/message.type";
import { OKResponse } from "../types/response";
import ApiFeature from "../utils/apiFeatures";
import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";
import fs from "fs";
import path from "path";

export const getChatMessages = catchErrors(async (req, res, next) => {
  const chat = req.chat;
  const queryString: IQueryString = {
    page: +(req.query.page as string),
    pageSize: +(req.query.pageSize as string),
    sort: "-createdAt",
    search: req.query.search as string,
  }
  const apiFeature = new ApiFeature(messageModel.find({ chat: chat._id }).populate("user"), queryString, { chat: chat._id })
    .paginate()
    .sort()
    .search({
      content: { $regex: req.query.search, $options: "i" }
    });
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

  const response: OKResponse = {
    message: "Success",
    data: message,
  };
  res.status(201).json(response);
});

export const updateMessage = catchErrors(async (req, res, next) => {
  const message = req.message;
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

  const response: OKResponse = {
    message: "Success",
    data: message,
  };
  res.status(202).json(response);
});

export const deleteMessage = catchErrors(async (req, res, next) => {
  const message = req.message;

  if (message.files.length !== 0) {
    message.files.forEach((file: string) => {
      const fileURL = path.join("uploads", file);
      fs.unlink(fileURL, (err) => {
        if (err) console.log(err);
      });
    });
  };

  await message.deleteOne();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});