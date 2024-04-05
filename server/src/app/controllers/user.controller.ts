import { validationResult } from "express-validator";
import fs from "fs";
import userModel from "../models/user.model";
import { OKResponse } from "../types/response";
import ApiFeature from "../utils/apiFeatures";
import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";
import generateRandomCode from "../utils/generateRandomCode";
import sendMails from "../utils/sendMails";

export const getAllUsers = catchErrors(async (req, res, next) => {
  req.query.fields = "-createdAt -updatedAt";
  const apiFeature = new ApiFeature(userModel.find(), req.query)
    .paginate()
    .filter()
    .fields()
    .search({
      $or: [
        { fname: { $regex: req.query.search, $options: "i" } },
        { lname: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ]
    })
    .sort();
    const result = await apiFeature.get();
    const total = result.length;
  const response: OKResponse = {
    message: "Success",
    data: {
      result,
      total,
    },
  };
  res.status(200).json(response);
});


export const getUser = catchErrors(async (req, res, next) => {
  const user = req.user;
  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(200).json(response);
});


export const updateUser = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  user.fname = req.body.fname || user.fname;
  user.lname = req.body.lname || user.lname;

  if (req.file) {
    if (user.logo) {
      fs.unlink(`uploads/${user.logo}`, (err) => {
        if(err) console.log(err);
      });
    }
    user.logo = req.file.filename;
  }
  
  await user.save();
  user.password = undefined;

  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(202).json(response);
});


export const updatePassword = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  user.password = req.body.password;
  await user.save();
  user.password = undefined;

  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(202).json(response);
});


export const updateRole = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.user;
  if (user.role === "admin") return next(errorMessage(403, "Access Denied"));
  else if (user.role === "user") user.role = "moderator";
  else user.role = "user";
  await user.save();
  user.password = undefined;

  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(200).json(response);
});


export const requestUpdateEmail = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const user = req.authUser;
  const email = req.body.email;
  const code = generateRandomCode(8);
  const to = email;
  const subject = "Verification Code";
  const message = `Your verification code is ${code}`;
  sendMails(to, subject, message);

  user.emailVerificationCode = {
    code,
    expireAt: new Date(new Date().getTime() + 5 * 60000),
  };
  user.newEmail = email;
  await user.save();
  const response: OKResponse = {message: "Please check new email address for the code"};

  res.status(200).json(response);
});


export const verifyNewEmail = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.authUser;
  user.email = user.newEmail;
  user.newEmail = undefined;
  user.emailVerificationCode = undefined;
  await user.save();
  user.password = undefined;

  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(202).json(response);
});


export const deleteUser = catchErrors(async (req, res, next) => {
  const user = req.user;

  if (user.logo) {
    fs.unlink(`uploads/${user.logo}`, (err) => {
      if(err) console.log(err);
    });
  }

  await userModel.findOneAndDelete({_id: user._id});

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});
