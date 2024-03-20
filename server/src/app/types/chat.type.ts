import { Document, Types } from "mongoose";
import { IUserSchema } from "./user.type";
import { IFriendShipSchema } from "./friendShip.type";

export interface IChatPrivate {
  friendShip: Types.ObjectId;
};

interface IChat {
  name: string;
  description?: string;
  logo?: string;
  access: "public" | "private";
  admin: Types.ObjectId | IUserSchema;
};

export interface IChatGroup extends IChat {
  type: "group";
};

export interface IChatSchema extends IChat, Document {
  type: "group" | "private";
  friendShip?: Types.ObjectId | IFriendShipSchema;
};


export interface IChatUser {
  userRole: "admin" | "moderator" | "user";
  user: Types.ObjectId | IUserSchema;
  chat: Types.ObjectId | IChatSchema;
};

export interface IChatUserSchema extends IChatUser, Document { };