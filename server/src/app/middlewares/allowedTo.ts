import { Request, NextFunction, Response } from "express";
import catchError from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";
import CustomRequest from "../types/customRequest";

const allowedTo = (...roles: string[]) => {
  if (roles.length === 0) roles = ["admin", "moderator", "user"];
  return catchError(async (req: CustomRequest, res: Response, next: NextFunction) => {
    if(!roles.includes(req.authUser.role)) return next(errorMessage(401, `Not Authorized To Access This Route You Are ${req.authUser?.role}`));
    next();
  });
};

export default allowedTo;