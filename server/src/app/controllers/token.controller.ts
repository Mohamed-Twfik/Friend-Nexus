import { validationResult } from "express-validator";
import tokenModel from "../models/token.model";
import { OKResponse } from "../types/response";
import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";

export const getUserTokens = catchErrors(async (req, res, next) => {
  const user = req.user;
  const tokens = await tokenModel.find({ user: user._id });

  const response: OKResponse = {
    message: "Success",
    data: tokens
  };
  res.status(200).json(response);
});


export const getOneToken = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));

  const token = req.wantedToken;
  
  const response: OKResponse = {
    message: "Success",
    data: token
  };
  res.status(200).json(response);
});


export const deleteToken = catchErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errorMessage(422, "Invalid Data", errors.array()));
  
  const token = req.wantedToken;
  await token.deleteOne();

  const response: OKResponse = {
    message: "Success",
  };
  res.status(200).json(response);
});