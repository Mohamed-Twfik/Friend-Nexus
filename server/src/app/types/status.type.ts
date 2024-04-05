import mongoose, { Document } from "mongoose";
import { IUserSchema } from "./user.type";

export interface IStatus {
  file?: string;
  content?: string;
  expireAt?: Date;
  user: mongoose.Types.ObjectId | IUserSchema;
}

export interface IStatusSchema extends IStatus, Document {}
