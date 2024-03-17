import mongoose from "mongoose";
import { IStatusSchema } from "../types/status.type";

const statusSchema = new mongoose.Schema<IStatusSchema>({
    file: {
      type: String
    },
    content: {
      type: String,
    },
    expireAt: {
      type: Date,
      default: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IStatusSchema>("Status", statusSchema);