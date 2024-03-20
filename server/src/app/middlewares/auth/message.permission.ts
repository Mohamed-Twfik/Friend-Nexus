import { validationResult } from "express-validator";
import chatModel from "../../models/chat.model";
import chatUserModel from "../../models/chatUser.model";
import friendShipModel from "../../models/friendShip.model";
import { IChatSchema } from "../../types/chat.type";
import catchErrors from "../../utils/catchErrors";
import errorMessage from "../../utils/errorMessage";

export const getAndAddChatMessagePermission = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const chat = req.chat;
  if (chat.type === "private") {
    const friendShip = await friendShipModel.findOne({ _id: chat.friendShip, $or: [{ user1: user._id }, { user2: user._id }] });
    if (!friendShip) return next(errorMessage(403, "Access Denied"));
  } else {
    const chatUser = await chatUserModel.findOne({ chat: chat._id, user: user._id });
    if (!chatUser) return next(errorMessage(403, "Access Denied"));
  }
  next();
});

export const checkMessageOwner = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const message = req.message;
  if (message.user.toString() !== user._id.toString()) return next(errorMessage(403, "Access Denied."));
  next();
});

export const deleteMessagePermission = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const message = req.message;
  const chat = await chatModel.findById(message.chat) as IChatSchema;
  if (chat.type === "private") {
    if(message.user.toString() !== user._id.toString()) return next(errorMessage(403, "Access Denied."));
  } else {
    if(message.user.toString() !== user._id.toString() && chat.admin.toString() !== user._id.toString()) return next(errorMessage(403, "Access Denied."));
  }
  next();
});