import express from "express";
import {
  friendShipValidator,
  sendFriendRequestValidator
} from "../middlewares/friendShip.validator";
import {
  getFriendList,
  getFriendRequestList,
  getFriendSendList,
  sendFriendRequest,
  acceptFriendRequest,
  deleteOrRejectFriend
} from "../controllers/friendShip.controller";

const router = express.Router();

router.get("/list", getFriendList);
router.get("/receive/list", getFriendRequestList);
router.get("/send/list", getFriendSendList);

router.post("/send/:userId", sendFriendRequestValidator(), sendFriendRequest);

router.patch("/accept/:userId", friendShipValidator(), acceptFriendRequest);

router.delete("/deleteOrReject/:userId", friendShipValidator(), deleteOrRejectFriend);

export default router;