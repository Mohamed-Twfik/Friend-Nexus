import mongoose from "mongoose";
import { DeviceDetectorResult } from "device-detector-js"

export default interface IToken {
  token: string
  client: DeviceDetectorResult["client"] | null
  os: DeviceDetectorResult["os"] | null
  device: DeviceDetectorResult["device"] | null
  bot: DeviceDetectorResult["bot"] | null
  user: mongoose.Types.ObjectId
}