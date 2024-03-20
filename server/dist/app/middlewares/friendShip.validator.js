"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFriendRequestValidator = exports.friendShipValidator = void 0;
const friendShip_model_1 = __importDefault(require("../models/friendShip.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const shared_validator_1 = require("./shared.validator");
const friendShipValidator = () => {
    return [
        (0, shared_validator_1.mongoIdValidator)("user", user_model_1.default).custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.authUser;
            const friend = req.user;
            const friendShip = yield friendShip_model_1.default.findOne({
                $or: [
                    { user1: user._id, user2: friend._id },
                    { user1: friend._id, user2: user._id }
                ]
            });
            if (!friendShip)
                throw new Error("Friend Not Found");
            req.friendShip = friendShip;
        }))
    ];
};
exports.friendShipValidator = friendShipValidator;
const sendFriendRequestValidator = () => {
    return [
        (0, shared_validator_1.mongoIdValidator)("user", user_model_1.default).custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.authUser;
            const friend = req.user;
            if (user._id.toString() === friend._id.toString()) {
                throw new Error("You can't send friend request to yourself");
            }
            const friendShip = yield friendShip_model_1.default.findOne({
                $or: [
                    { user1: user._id, user2: friend._id },
                    { user1: friend._id, user2: user._id }
                ]
            });
            if (friendShip) {
                if (friendShip.status === "pending") {
                    if (friendShip.user1.toString() === user._id.toString())
                        throw new Error("You already sent friend request to this user");
                    else
                        throw new Error("You already received friend request from this user please accept or reject it");
                }
                else if (friendShip.status === "accepted")
                    throw new Error("You are already friend with this user");
            }
        }))
    ];
};
exports.sendFriendRequestValidator = sendFriendRequestValidator;
