import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import {
  fnameValidator,
  lnameValidator,
  passwordValidator,
  mongoIdValidator
} from "./shared.validator";
import { body } from "express-validator";

export const userIdValidator = () => {
  return [
    mongoIdValidator("user", userModel),
  ];
};

export const updateUserValidator = () => {
  return [
    fnameValidator().optional(),

    lnameValidator().optional(),
  ];
};

export const updatePasswordValidator = () => { 
  return [
    passwordValidator("Incorrect Old Password", "oldPassword")
      .bail({ level: "request" })
      .custom(async (value, { req }) => {
        const user = req.authUser; 
        const userData = await userModel.findById(user._id).select({ password: 1 });
        const match = await bcrypt.compare(value, userData?.password || "");
        if (!match) throw new Error("Incorrect Old Password");
      })
      .bail({ level: "request" }),
    
    passwordValidator("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character")
  ];
};

export const requestUpdateEmailValidator = () => {
  return [
    body("email")
      .trim()
      .isEmail().withMessage("Invalid Email")
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const user = await userModel.findOne({ email: value });
        if (user) throw new Error("Email Already Exists");
      }),
  ];
};

export const verifyNewEmailValidator = () => {
  return [
    body("code")
      .trim()
      .isLength({ min: 8 }).withMessage("Invalid Code")
      .custom(async (value, { req }) => {
        const user = req.authUser;
        if (!user.newEmail) throw new Error("Please request to update email first");

        else if (user.emailVerificationCode.code !== value) throw new Error("Invalid Code");

        else if (user.emailVerificationCode.expireAt < new Date()) throw new Error("Code Expired");
      })
  ];
};