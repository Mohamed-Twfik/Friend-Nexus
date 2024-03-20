import catchErrors from "../utils/catchErrors";
import chatUserModel from "../models/chatUser.model";
import errorMessage from "../utils/errorMessage";
import { validationResult } from "express-validator"

export const checkChatMember = (userType: string) => {
  return catchErrors(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

    const user = req[userType];
    const chat = req.chat;
    if(chat.type === "private") return next(errorMessage(403, "Access Denied"));
    const chatUser = await chatUserModel.findOne({ chat: chat._id, user: user._id });
    if (!chatUser) return next(errorMessage(403, "Access Denied"));
    req.chatUser = chatUser;
    next();
  });
}

export const checkChatModerator = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const chat = req.chat;
  if(chat.type === "private") return next(errorMessage(403, "Access Denied"));
  const chatUser = await chatUserModel.findOne({ chat: chat._id, user: user._id, userRole: { $ne: "user" } });
  if (!chatUser) return next(errorMessage(403, "Access Denied"));
  next();
});

export const checkChatAdmin = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const chat = req.chat;
  if(chat.type === "private") return next(errorMessage(403, "Access Denied"));
  const chatUser = await chatUserModel.findOne({ chat: chat._id, user: user._id, userRole: "admin" });
  if (!chatUser) return next(errorMessage(403, "Access Denied"));
  next();
});

export const checkChatAccess = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  const chat = req.chat;
  if(chat.type === "private" || chat.access === "private") return next(errorMessage(403, "Access Denied"));
  req.user = user;
  next();
});