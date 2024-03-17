import mongoose, { Document } from "mongoose";
import { IUserSchema } from "./user.type";

export interface IFriendShip {
  status?: "pending" | "accepted";
  user1: mongoose.Types.ObjectId | IUserSchema;
  user2: mongoose.Types.ObjectId | IUserSchema;
};

export interface IFriendShipSchema extends IFriendShip, Document {}