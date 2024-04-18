import express from "express";
import {
  acceptFriendRequest,
  deleteOrRejectFriend,
  getFriendList,
  getFriendReceiveList,
  getFriendSendList,
  sendFriendRequest
} from "../controllers/friendShip.controller";
import {
  friendShipValidator,
  sendFriendRequestValidator
} from "../middlewares/validators/friendShip.validator";

const router = express.Router();

router.get("/list", getFriendList);
router.get("/receive/list", getFriendReceiveList);
router.get("/send/list", getFriendSendList);

router.post("/send/:userId", sendFriendRequestValidator(), sendFriendRequest);

router.patch("/accept/:userId", friendShipValidator(), acceptFriendRequest);

router.delete("/deleteOrReject/:userId", friendShipValidator(), deleteOrRejectFriend);

export default router;