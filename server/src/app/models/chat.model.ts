import mongoose, { Query, Document } from "mongoose";
import { IChatSchema } from "../types/chat.type";
import chatUserModel from "./chatUser.model";
import messageModel from "./message.model";

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
      unique: true,
    },
  },
  { timestamps: true }
);

chatSchema.post("findOneAndDelete", async function (doc) {
  await chatUserModel.deleteMany({ chat: doc._id });
  await messageModel.deleteMany({ chat: doc._id });
})

export default mongoose.model<IChatSchema>("Chat", chatSchema);