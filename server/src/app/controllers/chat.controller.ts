import { IChatGroup, IChatSchema, IChatUser } from "../types/chat.type";
import catchErrors from "../utils/catchErrors";
import ChatModel from "../models/chat.model";
import chatUserModel from "../models/chatUser.model";
import { OKResponse } from "../types/response";
import { validationResult } from "express-validator";
import errorMessage from "../utils/errorMessage";
import ApiFeatures from "../utils/apiFeatures";
import { IFriendShipSchema } from "../types/friendShip.type";
import friendShipModel from "../models/friendShip.model";
import userModel from "../models/user.model";
import { IUserSchema } from "../types/user.type";

export const getUserChats = catchErrors(async (req, res, next) => {
  const user = req.authUser;

  const queryString = {
    page: req.query.page,
    pageSize: req.query.pageSize,
    sort: "-createdAt",
  };
  const apiFeatures = new ApiFeatures(chatUserModel.find({ user: user._id }).populate("chat"), queryString)
    .paginate()
    .sort();
  const userChats = await apiFeatures.get();
  const chats = userChats.map(async (userChat: IChatUser) => {
    if ((userChat.chat as IChatSchema).type === "private") {
      const friendShip = (userChat.chat as IChatSchema).friendShip;
      let friend: IUserSchema = {} as IUserSchema;
      if ((friendShip as IFriendShipSchema).user1.toString() === user._id.toString()) {
        friend = await userModel.findById((friendShip as IFriendShipSchema).user2) as IUserSchema;
      }else if ((friendShip as IFriendShipSchema).user2.toString() === user._id.toString()) {
        friend = await userModel.findById((friendShip as IFriendShipSchema).user1) as IUserSchema;
      };
      (userChat.chat as IChatSchema).name = `${friend.fname} ${friend.lname}`;
      (userChat.chat as IChatSchema).logo = `${friend.logo}`;
    };
    return userChat.chat
  });
  const total = userChats.length;

  const response: OKResponse = {
    message: "Success",
    data: {
      result: chats,
      total,
    },
  };
  res.status(200).json(response);
});

export const getOneChat = catchErrors(async (req, res, next) => {
  const chat = req.chat;

  const response: OKResponse = {
    message: "Success",
    data: chat,
  };
  res.status(200).json(response);
});

export const createChat = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const { name, description, access } = req.body;
  const chatData: IChatGroup = {
    type: "group",
    name: name,
    access: access || "private",
    description: description || `Chat group for ${name}`,
    admin: user._id
  };
  const chat = await ChatModel.create(chatData);
  const chatUserData: IChatUser = {
    userRole: "admin",
    user: user._id,
    chat: chat._id
  };
  const chatUser = await chatUserModel.create(chatUserData);

  const response: OKResponse = {
    message: "Success",
    data: chat
  };
  res.status(201).json(response);
});

export const updateChat = catchErrors(async (req, res, next) => {
  const chat = req.chat;
  const { name, description } = req.body;
  
  chat.name = name || chat.name;
  chat.description = description || chat.description;
  await chat.save();

  const response: OKResponse = {
    message: "Success",
    data: chat,
  };
  res.status(202).json(response);
});

export const deleteChat = catchErrors(async (req, res, next) => {
  const chat = req.chat;
  await chat.deleteOne();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});

export const getChatUsers = catchErrors(async (req, res, next) => {
  const chat = req.chat;

  const queryString = {
    page: req.query.page,
    pageSize: req.query.pageSize,
  };
  const apiFeatures = new ApiFeatures(chatUserModel.find({ chat: chat._id }).populate("user"), queryString)
    .paginate();
  const chatUsers = await apiFeatures.get();
  const users = chatUsers.map((chatUser: IChatUser) => chatUser.user);
  const total = chatUsers.length;

  const response: OKResponse = {
    message: "Success",
    data: {
      result: users,
      total,
    },
  };
  res.status(200).json(response);
});

export const addChatUser = catchErrors(async (req, res, next) => {
  const chat = req.chat;
  const user = req.user;
  const chatUser = await chatUserModel.findOne({ chat: chat._id, user: user._id });
  if (chatUser) return next(errorMessage(409, "User Already In Chat"));
  
  const chatUserData: IChatUser = {
    userRole: "user",
    user: user._id,
    chat: chat._id
  };
  const newChatUser = await chatUserModel.create(chatUserData);

  const response: OKResponse = {
    message: "Success",
  };
  res.status(201).json(response);
});

export const updateChatUserRole = catchErrors(async (req, res, next) => {
  const chatUser = req.chatUser;
  if (chatUser.userRole === "admin") return next(errorMessage(403, "Access Denied"));
  else if (chatUser.userRole === "moderator") chatUser.userRole = "user";
  else chatUser.userRole = "moderator";
  await chatUser.save();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});

export const removeChatUser = catchErrors(async (req, res, next) => {
  const chatUser = req.chatUser;
  if (chatUser.userRole === "admin") return next(errorMessage(403, "Access Denied"));
  await chatUser.deleteOne();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});

export const leaveChat = catchErrors(async (req, res, next) => {
  const chat = req.chat;
  const chatUser = req.chatUser;
  if (chatUser.userRole === "admin") {
    const firstChatUser = await chatUserModel.findOne({ chat: chat._id });
    if(!firstChatUser) await chat.deleteOne();
    else firstChatUser.userRole = "admin";
  };
  await chatUser.deleteOne();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});