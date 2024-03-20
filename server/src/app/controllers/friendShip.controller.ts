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

export const getFriendList = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.authUser;
  const search = req.query.search+"" || "";
  const queryString = {
    page: req.query.page,
    pageSize: req.query.pageSize,
    sort: req.query.sort || "-createdAt",
  };
  const apiFeature = new ApiFeature(friendShipModel.find({
    $and: [
      { status: "accepted" },
      { $or: [
          { user1: user._id },
          { user2: user._id }
        ]
      }
    ]
  }).populate({
    path: "user1",
    select: "-password -changePasswordAt -__v"
  }).populate({
    path: "user2",
    select: "-password -changePasswordAt -__v"
  }), queryString)
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

  const total = friendList.length;

  const response: OKResponse = {
    message: "Success",
    data: {
      result: friendList,
      total,
    },
  };
  res.status(200).json(response);
});


export const getFriendRequestList = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.authUser;
  const search = req.query.search+"" || "";
  const queryString = {
    page: req.query.page,
    pageSize: req.query.pageSize,
    sort: req.query.sort || "-createdAt",
  };
  const apiFeature = new ApiFeature(friendShipModel.find({
    $and: [
      { status: "pending" },
      { user2: user._id }
    ]
  }).populate("user1"), queryString)
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

  const total = friendRequestList.length;

  const response: OKResponse = {
    message: "Success",
    data: {
      result: friendRequestList,
      total,
    },
  };
  res.status(200).json(response);
});


export const getFriendSendList = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.authUser;
  const search = req.query.search+"" || "";
  const queryString = {
    page: req.query.page,
    pageSize: req.query.pageSize,
    sort: req.query.sort || "-createdAt",
  };
  const apiFeature = new ApiFeature(friendShipModel.find({
    $and: [
      { status: "pending" },
      { user1: user._id }
    ]
  }).populate("user2"), queryString)
    .paginate()
    .sort();
  const friendShips = await apiFeature.get();
  console.log(friendShips);

  const friendSendList = friendShips.map((friendShip: IFriendShipSchema) => {
    const regex = new RegExp(search, "i");
    const user2 = friendShip.user2 as IUserSchema;
    if (req.query.search) {
      if ((regex.test(user2.fname) || regex.test(user2.lname) || regex.test(user2.email))) return user2;
    }
    else return user2;
  });

  const total = friendSendList.length;

  const response: OKResponse = {
    message: "Success",
    data: {
      result: friendSendList,
      total,
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

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});


export const deleteOrRejectFriend = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const friendShip = req.friendShip;
  await friendShip.deleteOne();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});