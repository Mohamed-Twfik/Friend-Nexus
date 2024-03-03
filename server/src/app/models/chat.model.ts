import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
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
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);