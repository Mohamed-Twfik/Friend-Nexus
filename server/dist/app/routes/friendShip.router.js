"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const friendShip_controller_1 = require("../controllers/friendShip.controller");
const friendShip_validator_1 = require("../middlewares/validators/friendShip.validator");
const router = express_1.default.Router();
router.get("/list", friendShip_controller_1.getFriendList);
router.get("/receive/list", friendShip_controller_1.getFriendReceiveList);
router.get("/send/list", friendShip_controller_1.getFriendSendList);
router.post("/send/:userId", (0, friendShip_validator_1.sendFriendRequestValidator)(), friendShip_controller_1.sendFriendRequest);
router.patch("/accept/:userId", (0, friendShip_validator_1.friendShipValidator)(), friendShip_controller_1.acceptFriendRequest);
router.delete("/deleteOrReject/:userId", (0, friendShip_validator_1.friendShipValidator)(), friendShip_controller_1.deleteOrRejectFriend);
exports.default = router;
