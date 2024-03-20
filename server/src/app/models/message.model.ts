import mongoose from "mongoose";
import { IMessageSchema } from "../types/message.type";

const messageSchema = new mongoose.Schema<IMessageSchema>({
    content: {
      type: String,
    },
    files: {
      type: [String],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMessageSchema>("Message", messageSchema);