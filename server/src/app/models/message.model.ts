import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true
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

export default mongoose.model("Message", messageSchema);