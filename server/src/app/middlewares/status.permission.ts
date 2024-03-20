import { validationResult } from "express-validator";
import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";
import friendShipModel from "../models/friendShip.model";

export const getOneStatusPermission = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const status = req.status;
  const friendShip = await friendShipModel.findOne({
    $or: [
      { $and: [{ user1: user._id }, { user2: status.user }, { status: "accepted" }] },
      { $and: [{ user1: status.user }, { user2: user._id }, { status: "accepted" }] },
    ],
  });
  if (!friendShip) return next(errorMessage(403, "Access Denied"));
  next();
});


export const deleteStatusPermission = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const status = req.status;
  if (status.user.toString() !== user._id.toString()) return next(errorMessage(403, "Access Denied"));
  next();
})