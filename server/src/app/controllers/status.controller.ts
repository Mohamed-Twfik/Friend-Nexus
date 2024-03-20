import statusModel from "../models/status.model";
import catchErrors from "../utils/catchErrors";
import ApiFeatures from "../utils/apiFeatures";
import { OKResponse } from "../types/response";
import friendShipModel from "../models/friendShip.model";
import { IStatus } from "../types/status.type";

export const getUserStatusList = catchErrors(async (req, res, next) => {
  const user = req.authUser;
  const queryString = {
    page: req.query.page,
    pageSize: req.query.pageSize,
    sort: "-createdAt",
    search: req.query.search,
    fields: "-__v",
  };
  const apiFeatures = new ApiFeatures(statusModel.find({ user: user._id }), queryString)
    .paginate()
    .fields()
    .search({
      content: { $regex: queryString.search, $options: "i" }
    })
    .sort();
  
  const statuses = await apiFeatures.get();
  const total = statuses.length;

  const response: OKResponse = {
    message: "Success",
    data: {
      statuses,
      total
    }
  };
  res.status(200).json(response);
});


export const getFriendsStatusList = catchErrors(async (req, res, next) => {
  const user = req.authUser;
  const queryString = {
    page: req.query.page,
    pageSize: req.query.pageSize,
    sort: "-createdAt",
    search: req.query.search,
    fields: "-__v",
  };

  const userFriends = await friendShipModel.find({
    $or: [
      { user1: user._id, status: "accepted" },
      { user2: user._id, status: "accepted" }
    ]
  });
  const friends = userFriends.map(friendShip => {
    if (friendShip.user1.toString() === user._id.toString()) return friendShip.user2;
    return friendShip.user1;
  });

  const apiFeatures = new ApiFeatures(statusModel.find({ user: { $in: friends } }), queryString)
    .paginate()
    .fields()
    .search({
      content: { $regex: queryString.search, $options: "i" }
    })
    .sort();
  
  const statuses = await apiFeatures.get();
  const total = statuses.length;

  const response: OKResponse = {
    message: "Success",
    data: {
      statuses,
      total
    }
  };
  res.status(200).json(response);
});


export const getOneStatus = catchErrors(async (req, res, next) => {
  const status = req.status;
  const response: OKResponse = {
    message: "Success",
    data: status,
  };
  res.status(200).json(response);
});


export const createStatus = catchErrors(async (req, res, next) => {
  const user = req.authUser;
  const { content } = req.body;
  const statusData: IStatus = {
    content: content || "",
    user: user._id
  }
  const status = await statusModel.create(statusData);

  const response: OKResponse = {
    message: "Success",
    data: status,
  };
  res.status(201).json(response);
});


export const deleteStatus = catchErrors(async (req, res, next) => {
  const status = req.status;
  await status.deleteOne();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});