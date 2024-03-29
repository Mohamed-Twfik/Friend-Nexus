import friendShipModel from "../../models/friendShip.model";
import userModel from "../../models/user.model";
import { mongoIdValidator } from "./shared.validator";

export const friendShipValidator = () => {
  return mongoIdValidator("user", userModel).custom(async (value, { req }) => {
    const user = req.authUser;
    const friend = req.user;
    const friendShip = await friendShipModel.findOne({
      $or: [
        { user1: user._id, user2: friend._id },
        { user1: friend._id, user2: user._id }
      ]
    });
    if (!friendShip) throw new Error("Friend Not Found");
    req.friendShip = friendShip;
  });
};


export const sendFriendRequestValidator = () => {
  return mongoIdValidator("user", userModel).custom(async (value, { req }) => {
    const user = req.authUser;
    const friend = req.user;
    if (user._id.toString() === friend._id.toString()) {
      throw new Error("You can't send friend request to yourself");
    }
    const friendShip = await friendShipModel.findOne({
      $or: [
        { user1: user._id, user2: friend._id },
        { user1: friend._id, user2: user._id }
      ]
    });
    if (friendShip) {
      if (friendShip.status === "pending") {
        if (friendShip.user1.toString() === user._id.toString()) throw new Error("You already sent friend request to this user");
        else throw new Error("You already received friend request from this user please accept or reject it");
      }
      else if (friendShip.status === "accepted") throw new Error("You are already friend with this user");
    }
  });
};