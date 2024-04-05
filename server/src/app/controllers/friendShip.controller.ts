import { NextFunction, Response } from "express";
import CustomRequest from "../types/customRequest";
import friendShipModel from "../models/friendShip.model";
import { OKResponse } from "../types/response";
import catchErrors from "../utils/catchErrors";
import ApiFeature from "../utils/apiFeatures";
import { validationResult } from "express-validator";
import errorMessage from "../utils/errorMessage";
import { IFriendShipSchema, IFriendShip } from "../types/friendShip.type";
import { IUserSchema } from "../types/user.type";
import { IChatPrivate, IChatUser } from "../types/chat.type";
import chatModel from "../models/chat.model";
import chatUserModel from "../models/chatUser.model";
import { IQueryString } from "../types/apiFeature.type";

export const getFriendList = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.authUser;
  const search = req.query.search as string;
  const queryString: IQueryString = {
    page: +(req.query.page as string),
    pageSize: +(req.query.pageSize as string),
    sort: req.query.sort as string || "-createdAt",
  };
  const condition = {
    $and: [
      { status: "accepted" },
      { $or: [
          { user1: user._id },
          { user2: user._id }
        ]
      }
    ]
  }
  const apiFeature = new ApiFeature(
    friendShipModel.find(condition).populate({
      path: "user1",
      select: "-password -changePasswordAt -__v"
    }).populate({
      path: "user2",
      select: "-password -changePasswordAt -__v"
    }),
    queryString, condition)
    .paginate()
    .sort();
  const friendShips = await apiFeature.get();
  
  const friendList = friendShips.map((friendShip: IFriendShipSchema) => {
    const regex = new RegExp(search, "i");
    const user1 = friendShip.user1 as IUserSchema;
    const user2 = friendShip.user2 as IUserSchema;
    if (user1._id.toString() === user._id.toString()) {
      if (req.query.search) {
        if ((regex.test(user2.fname) || regex.test(user2.lname) || regex.test(user2.email))) return user2;
      }
      else return user2;
    }
    else {
      if (req.query.search) {
        if ((regex.test(user1.fname) || regex.test(user1.lname) || regex.test(user1.email))) return user1;
      }
      else return user1;
    }
  });

  const totalLength = await apiFeature.getTotal();

  const response: OKResponse = {
    message: "Success",
    data: {
      result: friendList,
      totalLength,
    },
  };
  res.status(200).json(response);
});


export const getFriendRequestList = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.authUser;
  const search = req.query.search as string;
  const queryString: IQueryString = {
    page: +(req.query.page as string),
    pageSize: +(req.query.pageSize as string),
    sort: req.query.sort as string || "-createdAt",
  };
  const condition = {
    $and: [
      { status: "pending" },
      { user2: user._id }
    ]
  }
  const apiFeature = new ApiFeature(friendShipModel.find(condition).populate("user1"), queryString, condition)
    .paginate()
    .sort();
  const friendShips = await apiFeature.get();

  const friendRequestList = friendShips.map((friendShip: IFriendShipSchema) => {
    const regex = new RegExp(search, "i");
    const user1 = friendShip.user1 as IUserSchema;
    if (req.query.search) {
      if ((regex.test(user1.fname) || regex.test(user1.lname) || regex.test(user1.email))) return user1;
    }
    else return user1;
  });

  const totalLength = await apiFeature.getTotal();

  const response: OKResponse = {
    message: "Success",
    data: {
      result: friendRequestList,
      totalLength,
    },
  };
  res.status(200).json(response);
});


export const getFriendSendList = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.authUser;
  const search = req.query.search as string;
  const queryString: IQueryString = {
    page: +(req.query.page as string),
    pageSize: +(req.query.pageSize as string),
    sort: req.query.sort as string || "-createdAt",
  };
  const condition = {
    $and: [
      { status: "pending" },
      { user1: user._id }
    ]
  }
  const apiFeature = new ApiFeature(friendShipModel.find(condition).populate("user2"), queryString, condition)
    .paginate()
    .sort();
  const friendShips = await apiFeature.get();

  const friendSendList = friendShips.map((friendShip: IFriendShipSchema) => {
    const regex = new RegExp(search, "i");
    const user2 = friendShip.user2 as IUserSchema;
    if (req.query.search) {
      if ((regex.test(user2.fname) || regex.test(user2.lname) || regex.test(user2.email))) return user2;
    }
    else return user2;
  });

  const totalLength = await apiFeature.getTotal();

  const response: OKResponse = {
    message: "Success",
    data: {
      result: friendSendList,
      totalLength,
    },
  };
  res.status(200).json(response);
});


export const sendFriendRequest = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const user = req.authUser;
  const friend = req.user;
  const friendShipData: IFriendShip = {
    user1: user._id,
    user2: friend._id,
  }
  await friendShipModel.create(friendShipData);
  
  const response: OKResponse = {
    message: "Success",
  };
  res.status(201).json(response);
});


export const acceptFriendRequest = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const friendShip = req.friendShip;
  friendShip.status = "accepted";
  await friendShip.save();
  const chatData: IChatPrivate = {
    friendShip: friendShip._id
  };
  const chat = await chatModel.create(chatData);
  const chatUser1: IChatUser = {
    chat: chat._id,
    user: friendShip.user1,
    userRole: "user",
  };
  const chatUser2: IChatUser = {
    chat: chat._id,
    user: friendShip.user2,
    userRole: "user",
  };
  await chatUserModel.create(chatUser1);
  await chatUserModel.create(chatUser2);

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});


export const deleteOrRejectFriend = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const friendShip = req.friendShip;
  await friendShipModel.findOneAndDelete({ _id: friendShip._id });

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});