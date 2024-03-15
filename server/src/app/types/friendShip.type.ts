import mongoose, { Document } from "mongoose";
import IUser from "./user.type";

export default interface IFriendShip extends Document{
  status: "pending" | "accepted";
  user1: mongoose.Types.ObjectId | IUser;
  user2: mongoose.Types.ObjectId | IUser;
};