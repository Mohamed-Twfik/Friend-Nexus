import mongoose, { Document } from "mongoose";
import { DeviceDetectorResult } from "device-detector-js"
import IUser from "./user.type";

export default interface IToken extends Document{
  token: string
  client: DeviceDetectorResult["client"] | null
  os: DeviceDetectorResult["os"] | null
  device: DeviceDetectorResult["device"] | null
  bot: DeviceDetectorResult["bot"] | null
  user: mongoose.Types.ObjectId | IUser
}