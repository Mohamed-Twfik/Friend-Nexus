import { validationResult } from "express-validator";
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
  const user = req.wantedUser;
  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(200).json(response);
});


export const updateUser = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.user;
  user.fname = req.body.fname || user.fname;
  user.lname = req.body.lname || user.lname;

  await user.save();

  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(202).json(response);
});


export const updatePassword = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const user = req.user;
  user.password = req.body.password;
  await user.save();
  delete user.password;

  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(202).json(response);
});


export const updateRole = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return next(errorMessage(422, "Invalid Id", errors.array()));

  const user = req.wantedUser;
  if (user.role === "admin") return next(errorMessage(403, "You can't change admin role"));
  else if (user.role === "user") user.role = "moderator";
  else user.role = "user";
  await user.save();

  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(200).json(response);
});


export const requestUpdateEmail = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const user = req.user;
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

  const user = req.user;
  user.email = user.newEmail;
  user.newEmail = undefined;
  user.emailVerificationCode = undefined;
  await user.save();

  const response: OKResponse = {
    message: "Success",
    data: user,
  };
  res.status(202).json(response);
});


export const deleteUser = catchErrors(async (req, res, next) => {
  const user = req.wantedUser;
  await user.deleteOne();
  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});
