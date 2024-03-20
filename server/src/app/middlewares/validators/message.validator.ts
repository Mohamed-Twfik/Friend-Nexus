import { body } from "express-validator";
import messageModel from "../../models/message.model";
import { chatIdValidator } from "./chat.validator";
import { mongoIdValidator } from "./shared.validator";

const contentValidator = () => {
  return body("content")
    .trim()
    .isString()
    .isLength({ min: 1 }).withMessage("Message content must be a string with at least 1 characters long")
    .escape()
    .optional();
};

export const messageIdValidator = () => {
  return mongoIdValidator("message", messageModel)
};

export const createMessageValidator = () => {
  return [
    chatIdValidator(),

    contentValidator()
  ]
};

export const updateMessageValidator = () => {
  return [
    messageIdValidator(),

    contentValidator()
  ];
};