import mongoose from "mongoose";
import { IFriendShipSchema } from "../types/friendShip.type";

const friendShipSchema = new mongoose.Schema<IFriendShipSchema>({
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending"
    },
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFriendShipSchema>("FriendShip", friendShipSchema);