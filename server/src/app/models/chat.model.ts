import mongoose from "mongoose";
import { IChatSchema } from "../types/chat.type";

const chatSchema = new mongoose.Schema<IChatSchema>({
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    type: {
      type: String,
      enum: ["group", "private"],
      default: "private",
      required: true,
    },
    access: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    friendShip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FriendShip",
      index: true
    },
  },
  { timestamps: true }
);

export default mongoose.model<IChatSchema>("Chat", chatSchema);