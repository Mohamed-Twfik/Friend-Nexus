import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";
import CustomRequest from "../types/customRequest";

dotenv.config();

export default catchErrors(async(req: CustomRequest, res: Response, next: NextFunction)=>{
  const {DB_URL, MAIL_USER, MAIL_PASS, JWT_SECRET, MAX_DEVICES_ALLOWED} = process.env;
  if(!DB_URL || !MAIL_USER || !MAIL_PASS || !JWT_SECRET || !MAX_DEVICES_ALLOWED) return next(errorMessage(500, "Missing Environment Variable"));
  else return next();
});