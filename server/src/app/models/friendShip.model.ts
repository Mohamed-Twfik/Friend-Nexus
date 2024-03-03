import mongoose from "mongoose";

const friendShipSchema = new mongoose.Schema({
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
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

export default mongoose.model("FriendShip", friendShipSchema);