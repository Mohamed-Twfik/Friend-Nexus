import mongoose from "mongoose";

const chatUserSchema = new mongoose.Schema({
    userRole: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user"
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

export default mongoose.model("ChatUser", chatUserSchema);