import { IChatGroup, IChatSchema, IChatUser } from "../types/chat.type";
import catchErrors from "../utils/catchErrors";
import chatModel from "../models/chat.model";
import chatUserModel from "../models/chatUser.model";
import { OKResponse } from "../types/response";
import { validationResult } from "express-validator";
import errorMessage from "../utils/errorMessage";
import ApiFeatures from "../utils/apiFeatures";
import { IFriendShipSchema } from "../types/friendShip.type";
import userModel from "../models/user.model";
import { IUserSchema } from "../types/user.type";
import fs from "fs";

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
      delete (userChat.chat as IChatSchema).friendShip;
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
  const user = req.authUser;
  if (chat.type === "private") {
    const friendShip = req.friendShip;
    let friend = {} as IUserSchema;
    if (friendShip.user1.toString() === user._id.toString()) {
      friend = await userModel.findById(friendShip.user2) as IUserSchema;
    }else if (friendShip.user2.toString() === user._id.toString()) {
      friend = await userModel.findById(friendShip.user1) as IUserSchema;
    };
    chat.name = `${friend.fname} ${friend.lname}`;
    chat.logo = `${friend.logo}`;
    delete chat.friendShip;
  }

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
  if(req.file) chatData.logo = req.file.filename; 
  const chat = await chatModel.create(chatData);
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

  if (req.file) {
    if (chat.logo) {
      fs.unlink(`uploads/${chat.logo}`, (err) => {
        if(err) console.log(err);
      });
    }
    chat.logo = req.file.filename;
  }

  await chat.save();

  const response: OKResponse = {
    message: "Success",
    data: chat,
  };
  res.status(202).json(response);
});

export const deleteChat = catchErrors(async (req, res, next) => {
  const chat = req.chat;

  if (chat.logo) {
    fs.unlink(`uploads/${chat.logo}`, (err) => {
      if(err) console.log(err);
    });
  }

  await chatModel.findOneAndDelete({ _id: chat._id });

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
    if(!firstChatUser) await chatModel.findOneAndDelete({ _id: chat._id });
    else {
      chat.admin = firstChatUser._id;
      firstChatUser.userRole = "admin";
      await chat.save();
      await firstChatUser.save();
    };
  };
  await chatUser.deleteOne();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});