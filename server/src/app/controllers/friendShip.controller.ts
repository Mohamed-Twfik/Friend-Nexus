import { NextFunction, Response } from "express";
import CustomRequest from "../types/customRequest";
import friendShipModel from "../models/friendShip.model";
import { OKResponse } from "../types/response";
import catchErrors from "../utils/catchErrors";
import { validationResult } from "express-validator";
import errorMessage from "../utils/errorMessage";
import { IFriendShip } from "../types/friendShip.type";
import { IChatPrivate, IChatUser } from "../types/chat.type";
import chatModel from "../models/chat.model";
import chatUserModel from "../models/chatUser.model";
import { IQueryString } from "../types/apiFeature.type";
import io from "../../socket";

export const getFriendList = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.authUser;
  const queryString: IQueryString = {
    page: +(req.query.page as string) || 1,
    pageSize: +(req.query.pageSize as string) || 5,
    sort: req.query.sort as string || "-createdAt",
    search: req.query.search as string || "",
  };

  const sharedAggregate = [
    {
      $match: {
        $or: [
          { user1: user._id },
          { user2: user._id }
        ],
        status: "accepted"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user1",
        foreignField: "_id",
        as: "user1"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user2",
        foreignField: "_id",
        as: "user2"
      }
    },
    {
      $unwind: "$user1"
    },
    {
      $unwind: "$user2"
    },
    {
      $project: {
        user: {
          $cond: {
            if: { $eq: ["$user1._id", user._id] },
            then: "$user2",
            else: "$user1"
          }
        }
      }
    },
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
      $match: {
        $or: [
          {"user.fname": { $regex: queryString.search, $options: "i" }},
          {"user.lname": { $regex: queryString.search, $options: "i" }},
          {"user.email": { $regex: queryString.search, $options: "i" }}
        ]
      }
    },
  ];

  const friendsListAggregate = [
    ...sharedAggregate,
    {
      $skip: ((queryString.page as number) - 1) * (queryString.pageSize as number)
    },
    {
      $limit: (queryString.pageSize as number)
    }
  ];

  const totalLengthAggregate = [
    ...sharedAggregate,
    {
      $count: "totalLength"
    }
  ];

  const friendsList = await friendShipModel.aggregate(friendsListAggregate);
  const friends = friendsList.map((friend: any) => friend.user);
  const totalLengthResult = await friendShipModel.aggregate(totalLengthAggregate);
  const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;

  const response: OKResponse = {
    message: "Success",
    data: {
      result: friends,
      totalLength,
    },
  };
  res.status(200).json(response);
});


export const getFriendReceiveList = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.authUser;
  const queryString: IQueryString = {
    page: +(req.query.page as string) || 1,
    pageSize: +(req.query.pageSize as string) || 5,
    sort: req.query.sort as string || "-createdAt",
    search: req.query.search as string || "",
  };
  
  const sharedAggregate = [
    {
      $match: {
        user2: user._id,
        status: "pending"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user1",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
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
      $match: {
        $or: [
          {"user.fname": { $regex: queryString.search, $options: "i" }},
          {"user.lname": { $regex: queryString.search, $options: "i" }},
          {"user.email": { $regex: queryString.search, $options: "i" }}
        ]
      }
    },
  ];

  const friendsListAggregate = [
    ...sharedAggregate,
    {
      $skip: ((queryString.page as number) - 1) * (queryString.pageSize as number)
    },
    {
      $limit: (queryString.pageSize as number)
    }
  ];

  const totalLengthAggregate = [
    ...sharedAggregate,
    {
      $count: "totalLength"
    }
  ];

  const friendsList = await friendShipModel.aggregate(friendsListAggregate);
  const friends = friendsList.map((friend: any) => friend.user);
  const totalLengthResult = await friendShipModel.aggregate(totalLengthAggregate);
  const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;

  const response: OKResponse = {
    message: "Success",
    data: {
      result: friends,
      totalLength,
    },
  };
  res.status(200).json(response);
});


export const getFriendSendList = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.authUser;
  const queryString: IQueryString = {
    page: +(req.query.page as string) || 1,
    pageSize: +(req.query.pageSize as string) || 5,
    sort: req.query.sort as string || "-createdAt",
    search: req.query.search as string || "",
  };
  
  const sharedAggregate = [
    {
      $match: {
        user1: user._id,
        status: "pending"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user2",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
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
      $match: {
        $or: [
          {"user.fname": { $regex: queryString.search, $options: "i" }},
          {"user.lname": { $regex: queryString.search, $options: "i" }},
          {"user.email": { $regex: queryString.search, $options: "i" }}
        ]
      }
    },
  ];

  const friendsListAggregate = [
    ...sharedAggregate,
    {
      $skip: ((queryString.page as number) - 1) * (queryString.pageSize as number)
    },
    {
      $limit: (queryString.pageSize as number)
    }
  ];

  const totalLengthAggregate = [
    ...sharedAggregate,
    {
      $count: "totalLength"
    }
  ];

  const friendsList = await friendShipModel.aggregate(friendsListAggregate);
  const friends = friendsList.map((friend: any) => friend.user);
  const totalLengthResult = await friendShipModel.aggregate(totalLengthAggregate);
  const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;

  const response: OKResponse = {
    message: "Success",
    data: {
      result: friends,
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

  io.getIO().in(friend.socketId).emit("friendShip", {
    action: "friendRequest",
    data: user
  });
  
  const response: OKResponse = {
    message: "Success",
  };
  res.status(201).json(response);
});


export const acceptFriendRequest = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const user = req.authUser;
  const friend = req.user;
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

  io.getIO().in(friend.socketId).emit("friendShip", {
    action: "acceptRequest",
    data: user
  });

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});


export const deleteOrRejectFriend = catchErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const friendShip = req.friendShip;
  const user = req.authUser;
  const friend = req.user;
  await friendShipModel.findOneAndDelete({ _id: friendShip._id });

  io.getIO().in(friend.socketId).emit("friendShip", {
    action: "deleteRequest",
    data: user
  });

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});