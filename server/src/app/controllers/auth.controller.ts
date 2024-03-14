import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import DeviceDetector from "device-detector-js";
import { validationResult } from "express-validator";

import errorMessage from "../utils/errorMessage";
import catchErrors from "../utils/catchErrors";
import userModel from "../models/user.model";
import tokenModel from "../models/token.model";
import generateRandomCode from "../utils/generateRandomCode";
import sendMails from "../utils/sendMails";

import {OKResponse} from "../types/response";
import userType from "../types/user.type";
import tokenType from "../types/token.type"; 

dotenv.config();
const detector = new DeviceDetector();

export const signin = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors));

  const user = req.user;
  if (!user.verified) return next(errorMessage(401, "Email Not Verified"));
  const userDevicesCount = await tokenModel.find({ user: user._id }).countDocuments();
  if (userDevicesCount >= parseInt(process.env.MAX_DEVICES_ALLOWED as string)) return next(errorMessage(401, `Maximum ${process.env.MAX_DEVICES_ALLOWED} devices are allowed`));

  const clientData = detector.parse(req.header("user-agent") as string);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {expiresIn: "1h"});
  
  const tokenData: tokenType = {
    token,
    client: clientData.client,
    os: clientData.os,
    device: clientData.device,
    bot: clientData.bot,
    user: user._id
  }
  await tokenModel.create(tokenData);

  const response: OKResponse = {
    message: "Login Success",
    data: {
      userId: user._id,
      token
    }
  }
  return res.status(200).json(response);
});


export const signup = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors));

  const { email, password, fname, lname } = req.body;
  const code = generateRandomCode(8);
  const to = email;
  const subject = "Verification Code";
  const message = `Your verification code is ${code}`;
  sendMails(to, subject, message);

  const userData: userType = {
    email,
    password,
    fname,
    lname,
    emailVerificationCode:{code, expireAt: new Date(new Date().getTime() + 5 * 60000)}
  };
  const user = await userModel.create(userData);
  const response: OKResponse = {message: "Please check your email for code"};
  return res.status(201).json(response);

});


export const verifyEmail = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors));

  const user = req.user;
  user.emailVerificationCode = undefined;
  user.verified = true;
  await user.save();
  const response: OKResponse = { message: "Email Verified Successfully" };
  return res.status(202).json(response);
});


export const resetPassword = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors));

  const user = req.user;
  const code = generateRandomCode(8);
  
  const to = user.email;
  const subject = "Reset Password Code";
  const message = `Your reset password code is ${code}`;
  sendMails(to, subject, message);
  user.resetPasswordCode = { 
    code,
    expireAt: new Date(new Date().getTime() + 5 * 60000)
  };

  await user.save();
  const response: OKResponse = {message: "Please check your email for code"};
  return res.status(201).json(response);
});


export const newPassword = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors));

  const { password } = req.body;
  const user = req.user;
  user.password = password;
  user.resetPasswordCode = undefined;
  await user.save();
  const response: OKResponse = { message: "Password reset Successfully" };
  return res.status(202).json(response);
});


export const signout = catchErrors(async (req, res, next)=>{
  const user = req.user;
  const token = req.token;
  await tokenModel.findOneAndDelete({token: token, user: user._id});
  const response: OKResponse = { message: "Signout Success" };
  res.status(200).json(response);
});
