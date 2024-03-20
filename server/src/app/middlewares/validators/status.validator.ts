import { body } from "express-validator";
import statusModel from "../../models/status.model";
import {
  mongoIdValidator
} from "./shared.validator";

export const statusIdValidator = () => {
  return mongoIdValidator("status", statusModel)
};


export const createStatusValidator = () => {
  return [
    body("content")
      .trim()
      .isLength({ min: 1, max: 1000 }).withMessage("Content must be between 1 to 1000 characters long")
      .escape()
      .optional()
  ];
};