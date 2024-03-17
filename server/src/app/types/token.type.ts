import mongoose, { Document } from "mongoose";
import { DeviceDetectorResult } from "device-detector-js"
import { IUserSchema } from "./user.type";

export interface IToken {
  token: string
  client: DeviceDetectorResult["client"] | null
  os: DeviceDetectorResult["os"] | null
  device: DeviceDetectorResult["device"] | null
  bot: DeviceDetectorResult["bot"] | null
  user: mongoose.Types.ObjectId | IUserSchema
}

export interface ITokenSchema extends IToken, Document {}