import messageModel from "../models/message.model";
import { IMessage } from "../types/message.type";
import { OKResponse } from "../types/response";
import ApiFeature from "../utils/apiFeatures";
import catchErrors from "../utils/catchErrors";

export const getChatMessages = catchErrors(async (req, res, next) => {
  const chat = req.chat;
  const queryString = {
    page: req.query.page,
    pageSize: req.query.pageSize,
    sort: "-createdAt",
    search: req.query.search,
  }
  const apiFeature = new ApiFeature(messageModel.find({ chat: chat._id }).populate("user"), queryString)
    .paginate()
    .sort()
    .search({
      content: { $regex: req.query.search, $options: "i" }
    });
  const messages = await apiFeature.get();
  const total = messages.length;

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

  const messageData: IMessage = {
    content: content || "",
    user: user._id,
    chat: chat._id,
  }
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

  message.content = content || message.content;
  await message.save();

  const response: OKResponse = {
    message: "Success",
    data: message,
  };
  res.status(202).json(response);
});

export const deleteMessage = catchErrors(async (req, res, next) => {
  const message = req.message;
  await message.deleteOne();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});