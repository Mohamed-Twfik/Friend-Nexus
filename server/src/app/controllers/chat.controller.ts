import { IChatGroup, IChatSchema, IChatUser } from "../types/chat.type";
import catchErrors from "../utils/catchErrors";
import chatModel from "../models/chat.model";
import chatUserModel from "../models/chatUser.model";
import { OKResponse } from "../types/response";
import { validationResult } from "express-validator";
import errorMessage from "../utils/errorMessage";
import userModel from "../models/user.model";
import { IUserSchema } from "../types/user.type";
import fs from "fs";
import path from "path";
import { IQueryString } from "../types/apiFeature.type";
import io from "../../socket";

export const getUserChats = catchErrors(async (req, res, next) => {
  const user = req.authUser;

  const queryString: IQueryString = {
    page: +(req.query.page as string) || 1,
    pageSize: +(req.query.pageSize as string) || 5,
    sort: "-createdAt",
    search: req.query.search as string || "",
  };
  
  const sharedAggregate = [
    {
      $match: {
        user: user._id
      }
    },
    {
      $lookup: {
        from: "chats",
        localField: "chat",
        foreignField: "_id",
        as: "chat"
      }
    },
    {
      $unwind: "$chat"
    },
    {
      $lookup: {
        from: "friendships",
        localField: "chat.friendShip",
        foreignField: "_id",
        as: "chat.friendShip"
      }
    },
    {
      $unwind: {
        path: "$chat.friendShip",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "chat.friendShip.user1",
        foreignField: "_id",
        as: "chat.friendShip.user1"
      }
    },
    {
      $unwind: {
        path: "$chat.friendShip.user1",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "chat.friendShip.user2",
        foreignField: "_id",
        as: "chat.friendShip.user2"
      }
    },
    {
      $unwind: {
        path: "$chat.friendShip.user2",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $match: {
        $or: [
          { "chat.name": { $regex: queryString.search, $options: "i" } },
          { "chat.description": { $regex: queryString.search, $options: "i" } },
          { "chat.friendShip.user1.fname": { $regex: queryString.search, $options: "i" } },
          { "chat.friendShip.user1.lname": { $regex: queryString.search, $options: "i" } },
          { "chat.friendShip.user1.email": { $regex: queryString.search, $options: "i" } },
          { "chat.friendShip.user2.fname": { $regex: queryString.search, $options: "i" } },
          { "chat.friendShip.user2.lname": { $regex: queryString.search, $options: "i" } },
          { "chat.friendShip.user2.email": { $regex: queryString.search, $options: "i" } },
        ]
      }
    },
  ];

  const userChatsAggregate = [
    ...sharedAggregate,
    {
      $project: {
        updatedAt: 1,
        chat: {
          _id: 1,
          type: 1,
          name: 1,
          description: 1,
          logo: 1,
          createdAt: 1,
          updatedAt: 1,
          friendShip: {
            user1: {
              _id: 1,
              fname: 1,
              lname: 1,
              email: 1,
              logo: 1,
            },
            user2: {
              _id: 1,
              fname: 1,
              lname: 1,
              email: 1,
              logo: 1,
            }
          }
        },
      }
    },
    {
      $skip: (queryString.page as number - 1) * (queryString.pageSize as number),
    },
    {
      $limit: queryString.pageSize as number,
    },
  ];

  const totalLengthAggregate = [
    ...sharedAggregate,
    {
      $count: "totalLength"
    }
  ];

  const userChats = await chatUserModel.aggregate(userChatsAggregate);
  const totalLengthResult = await chatUserModel.aggregate(totalLengthAggregate);
  const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;

  const chats = userChats.map((userChat) => {
    if ((userChat.chat as IChatSchema).type === "private") {
      let friend = {} as IUserSchema;
      
      
      if (userChat.chat.friendShip.user1._id.toString() === user._id.toString()) friend = userChat.chat.friendShip.user2 as IUserSchema;
      else if (userChat.chat.friendShip.user2._id.toString() === user._id.toString()) friend = userChat.chat.friendShip.user1 as IUserSchema;
      
      (userChat.chat as IChatSchema).name = `${friend.fname} ${friend.lname}`;
      (userChat.chat as IChatSchema).logo = `${friend.logo}`;
      (userChat.chat as IChatSchema).description = `${friend.fname} ${friend.lname} Friend Chat`;
    }
    (userChat.chat as IChatSchema).friendShip = undefined;
    return userChat.chat;
  });

  const response: OKResponse = {
    message: "Success",
    data: {
      result: chats,
      totalLength,
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
      const fileURL = path.join("uploads", chat.logo);
      fs.unlink(fileURL, (err) => {
        if(err) console.log(err);
      });
    }
    chat.logo = req.file.filename;
  }

  await chat.save();

  const data = {
    action: "update",
    data: chat
  };
  await sendEventToChatUsers(chat, data);

  const response: OKResponse = {
    message: "Success",
    data: chat,
  };
  res.status(202).json(response);
});

export const deleteChat = catchErrors(async (req, res, next) => {
  const chat = req.chat;

  if (chat.logo) {
    const fileURL = path.join("uploads", chat.logo);
    fs.unlink(fileURL, (err) => {
      if(err) console.log(err);
    });
  }
  const chatUsers = await chatUserModel.find({ chat: chat._id }).populate("user");
  await chatModel.findOneAndDelete({ _id: chat._id });

  chatUsers.forEach(chatUser => {
    const user = chatUser.user;
    io.getIO().in((user as IUserSchema).socketId as string).emit("chat", {
      action: "delete",
      data: chat
    });
  });

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});

export const getChatUsers = catchErrors(async (req, res, next) => {
  const chat = req.chat;
  const queryString: IQueryString = {
    page: +(req.query.page as string) || 1,
    pageSize: +(req.query.pageSize as string) || 5,
    search: req.query.search as string || "",
  };

  const sharedAggregate = [
    {
      $match: {
        chat: chat._id,
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user",
    },
    {
      $match: {
        user: { $ne: null },
        $or: [
          { "user.fname": { $regex: queryString.search, $options: "i" } },
          { "user.lname": { $regex: queryString.search, $options: "i" } },
          { "user.email": { $regex: queryString.search, $options: "i" } },
        ]
      }
    },
  ] 

  const totalLengthAggregate = [
    ...sharedAggregate,
    {
      $count: "totalLength"
    }
  ]

  const chatUsersAggregate = [
    ...sharedAggregate,
    {
      $project: {
        "user._id": 1,
        "user.fname": 1,
        "user.lname": 1,
        "user.email": 1,
        "user.logo": 1,
      }
    },
    {
      $skip: (queryString.page as number - 1) * (queryString.pageSize as number),
    },
    {
      $limit: queryString.pageSize as number,
    },
  ]

  const chatUsers = await chatUserModel.aggregate(chatUsersAggregate);
  const totalLengthResult = await chatUserModel.aggregate(totalLengthAggregate);
  const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;
  const users = chatUsers.map((chatUser: IChatUser) => chatUser.user);

  const response: OKResponse = {
    message: "Success",
    data: {
      result: users,
      totalLength,
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

  const data = {
    action: "addUser",
    data: user
  };
  await sendEventToChatUsers(chat, data);

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

  const user = await userModel.findById(chatUser.user);
  const chat = req.chat;
  const data = {
    action: "userRole",
    data: {
      user,
      role: chatUser.userRole
    }
  };
  io.getIO().in((user as IUserSchema).socketId as string).emit("chat", data);
  await sendEventToChatUsers(chat, data);

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});

export const removeChatUser = catchErrors(async (req, res, next) => {
  const chatUser = req.chatUser;
  if (chatUser.userRole === "admin") return next(errorMessage(403, "Access Denied"));
  await chatUser.deleteOne();

  const user = await userModel.findById(chatUser.user);
  const chat = req.chat;
  const data = {
    action: "removeUser",
    data: user
  };
  await sendEventToChatUsers(chat, data);

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

  const user = await userModel.findById(chatUser.user);
  const data = {
    action: "leaveChat",
    data: user
  };
  await sendEventToChatUsers(chat, data);

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});

const sendEventToChatUsers = async (chat: IChatSchema, data: any) => {
  const chatUsers = await chatUserModel.find({ chat: chat._id }).populate("user");
  chatUsers.forEach(chatUser => {
    const user = chatUser.user;
    io.getIO().in((user as IUserSchema).socketId as string).emit("chat", data);
  });
};