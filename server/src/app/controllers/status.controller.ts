import statusModel from "../models/status.model";
import catchErrors from "../utils/catchErrors";
import ApiFeatures from "../utils/apiFeatures";
import { OKResponse } from "../types/response";
import { IStatus } from "../types/status.type";
import errorMessage from "../utils/errorMessage";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { IQueryString } from "../types/apiFeature.type";
import io from "../../socket";
import friendShipModel from "../models/friendShip.model";
import { IUserSchema } from "../types/user.type";

export const getUserStatusList = (to: "owner" | "friend") => {
  return catchErrors(async (req, res, next) => {
    let user;
    if (to === "owner") {
      user = req.authUser;
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
      user = req.user;
    }
    
    const queryString: IQueryString = {
      page: +(req.query.page as string),
      pageSize: +(req.query.pageSize as string),
      sort: "-createdAt",
      search: req.query.search as string
    };
    const apiFeatures = new ApiFeatures(statusModel.find({ user: user._id }), queryString, { user: user._id })
      .search({
        content: { $regex: queryString.search, $options: "i" }
      })
      .sort()
      .paginate();
    
    const statuses = await apiFeatures.get();
    const totalLength = await apiFeatures.getTotal();

    const response: OKResponse = {
      message: "Success",
      data: {
        result: statuses,
        totalLength
      }
    };
    res.status(200).json(response);
  });
};


export const getOneStatus = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const status = req.status;
  const response: OKResponse = {
    message: "Success",
    data: status,
  };
  res.status(200).json(response);
});


export const createStatus = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const user = req.authUser;
  const { content } = req.body;

  if(!content && !req.file) return next(errorMessage(422, "Content or file is required"));
  
  const statusData: IStatus = {
    user: user._id
  };
  if (req.file) statusData.file = req.file.filename;
  if (content) statusData.content = content;
  const status = await statusModel.create(statusData);

  const data = {
    action: "create",
    data: status
  };
  await sendSocketEvent(user, data);

  const response: OKResponse = {
    message: "Success",
    data: status,
  };
  res.status(201).json(response);
});


export const deleteStatus = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const user = req.authUser;
  const status = req.status;

  if (status.file) {
    const fileURL = path.join("uploads", status.file);
    fs.unlink(fileURL, (err) => {
      if(err) console.log(err);
    });
  }

  await status.deleteOne();

  const data = {
    action: "delete",
    data: status
  };
  await sendSocketEvent(user, data);

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});

const sendSocketEvent = async (user: IUserSchema, data: {action: string, data: object}) => {
  const friends = await friendShipModel.find({
    status: "accepted", $or: [
      { user1: user._id },
      { user2: user._id }
    ]
  }).populate("user1").populate("user2");
  friends.forEach(friend => {
    const friendSocketId = friend.user1._id.toString() === user._id.toString() ? (friend.user2 as IUserSchema).socketId : (friend.user1 as IUserSchema).socketId;
    io.getIO().in(friendSocketId as string).emit("status", data);
  });
}