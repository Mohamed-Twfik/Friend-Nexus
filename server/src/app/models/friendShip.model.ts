import mongoose, { Query } from "mongoose";
import { IFriendShipSchema } from "../types/friendShip.type";
import chatModel from "./chat.model";

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

friendShipSchema.post("findOneAndDelete", async function (doc) {
  await chatModel.deleteMany({ friendShip: doc._id });
});

export default mongoose.model<IFriendShipSchema>("FriendShip", friendShipSchema);