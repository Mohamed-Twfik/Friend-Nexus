import { validationResult } from "express-validator";
import friendShipModel from "../models/friendShip.model";
import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";

export const deleteUserPermission = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.user;
  const wantedUser = req.wantedUser;
  if(user.role === "admin" || user.role === "moderator" || user._id.toString() === wantedUser._id.toString()) return next();
  next(errorMessage(403, "Access Denied"));
});

export const getOneUserPermission = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.user;
  if (user.role === "admin" || user.role === "moderator") return next();
  const friendship = await friendShipModel.findOne({
    $or: [
      { $and: [{ user1: user._id }, { user2: req.params.userId }, { status: "accepted" }] },
      { $and: [{ user1: req.params.userId }, { user2: user._id }, { status: "accepted" }] },
    ],
  });
  if (!friendship) return next(errorMessage(403, "Access Denied"));
  req.friendship = friendship;
  next();
});