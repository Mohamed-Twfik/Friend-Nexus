import { validationResult } from "express-validator";
import friendShipModel from "../models/friendShip.model";
import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";

export const deleteUserPermission = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const wantedUser = req.user;
  if(user.role === "admin" || user.role === "moderator" || user._id.toString() === wantedUser._id.toString()) return next();
  next(errorMessage(403, "Access Denied"));
});

export const getOneUserPermission = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const wantedUser = req.user;
  if (user.role === "admin" || user.role === "moderator") return next();
  const friendship = await friendShipModel.findOne({
    $or: [
      { $and: [{ user1: user._id }, { user2: wantedUser._id }, { status: "accepted" }] },
      { $and: [{ user1: wantedUser._id }, { user2: user._id }, { status: "accepted" }] },
    ],
  });
  if (!friendship) return next(errorMessage(403, "Access Denied"));
  req.friendship = friendship;
  next();
});