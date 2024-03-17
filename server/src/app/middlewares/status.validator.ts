import { param, body } from "express-validator";
import statusModel from "../models/status.model";

export const statusIdValidator = () => {
  return [
    param("statusId")
      .isMongoId()
      .withMessage("Invalid Status ID")
      .bail()
      .custom(async (value, { req }) => {
        const status = await statusModel.findById(value);
        if (!status) throw new Error("Invalid Status Id");
        req.status = status;
      })
  ];
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