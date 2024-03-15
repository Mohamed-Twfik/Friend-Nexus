"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const friendShip_validator_1 = require("../middlewares/friendShip.validator");
const friendShip_controller_1 = require("../controllers/friendShip.controller");
const router = express_1.default.Router();
// 910
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjRjNGMyN2E1NzY0N2IwYjMxNmQxZCIsImlhdCI6MTcxMDU0MDAyMywiZXhwIjoxNzEwNTQzNjIzfQ.7tglValZv_kmECwLZBdapu3tLB6rAgo9M9ouS_5Ddn8
// 0910
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjRjM2JhZWY1NDE0MTNmN2Q5NjAwMCIsImlhdCI6MTcxMDUzOTk0OSwiZXhwIjoxNzEwNTQzNTQ5fQ.VVmxijvYksOE10At5yr-j8LjRitaDqI5N-KYzCvh_xg
router.get("/list", friendShip_controller_1.getFriendList);
router.get("/receive/list", friendShip_controller_1.getFriendRequestList);
router.get("/send/list", friendShip_controller_1.getFriendSendList);
router.post("/send/:userId", (0, friendShip_validator_1.sendFriendRequestValidator)(), friendShip_controller_1.sendFriendRequest);
router.patch("/accept/:userId", (0, friendShip_validator_1.friendShipValidator)(), friendShip_controller_1.acceptFriendRequest);
router.delete("/deleteOrReject/:userId", (0, friendShip_validator_1.friendShipValidator)(), friendShip_controller_1.deleteOrRejectFriend);
exports.default = router;
