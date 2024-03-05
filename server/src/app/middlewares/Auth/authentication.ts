import dotenv from "dotenv";
import { Request, NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../../models/user.model";
import catchError from "../../utils/catchErrors";
import errorMessage from "../../utils/errorMessage";
import CustomRequest from "../../types/customRequest";
import tokenModel from "../../models/token.model";

dotenv.config();

export default catchError(async (req: CustomRequest, res: Response, next: NextFunction) => {
  // [1] check if send token
  let token = req.headers.authorization;
  if (!token) return next(errorMessage(401, "Token required."));
  
  // [2] check if token valid or not
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
  const user = await User.findById(decoded.id);
  const tokenData = await tokenModel.findOne({token, user: user?._id});
  if (!user || !tokenData) return next(errorMessage(401, "Invalid Token"));

  // [3] when user change password compare time
  if (user.changePasswordAt) {
    let changePasswordDate = user.changePasswordAt.getTime() / 1000;
    const iat = decoded.iat || 0;
    if (changePasswordDate > iat)
      return next(errorMessage(401, "Password Changed"));
  }

  req.user = user;
  req.token = token;
  next();
});