import { body, param } from "express-validator";
import userModel from "../models/user.model";

export const emailValidator = (message: string) => {
  return body("email")
    .trim()
    .isEmail().withMessage(message)
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const user = await userModel.findOne({ email: value });
      if (!user) throw new Error(message);
      req.user = user;
    });
};

export const passwordValidator = (message: string, key: string = "password") => {
  return body(key)
    .trim()
    .isLength({ min: 8 }).withMessage(message)
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/).withMessage(message);
};

export const fnameValidator = () => { 
  return body("fname")
    .trim()
    .isLength({ min: 2 }).withMessage("First Name must be at least 2 characters long")
    .escape();
};

export const lnameValidator = () => { 
  return body("lname")
    .trim()
    .isLength({ min: 2 }).withMessage("Last Name must be at least 2 characters long")
    .escape();
};

export const codeValidator = (key: string, message: string) => {
  return body("code")
    .trim()
    .isLength({ min: 8 }).withMessage(message)
    .custom(async (value, { req }) => {
      const user = req.user;
      if (!user[key]) throw new Error("Code Not Found");

      else if (user[key].code !== value) throw new Error(message);

      else if (user[key].expireAt < new Date()) throw new Error("Code Expired");
    });
};

export const userIdValidator = () => {
  return param("userId")
    .isMongoId()
    .withMessage("Invalid User Id")
    .bail()
    .custom(async (value, { req }) => {
      const user = await userModel.findById(value);
      if (!user) throw new Error("Invalid User Id");
      req.wantedUser = user;
    });
};
