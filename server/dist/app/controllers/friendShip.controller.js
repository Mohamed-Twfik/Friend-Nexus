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
exports.deleteOrRejectFriend = exports.acceptFriendRequest = exports.sendFriendRequest = exports.getFriendSendList = exports.getFriendReceiveList = exports.getFriendList = void 0;
const friendShip_model_1 = __importDefault(require("../models/friendShip.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const express_validator_1 = require("express-validator");
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
const chat_model_1 = __importDefault(require("../models/chat.model"));
const chatUser_model_1 = __importDefault(require("../models/chatUser.model"));
const socket_1 = __importDefault(require("../../socket"));
exports.getFriendList = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const queryString = {
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 5,
        sort: req.query.sort || "-createdAt",
        search: req.query.search || "",
    };
    const sharedAggregate = [
        {
            $match: {
                $or: [
                    { user1: user._id },
                    { user2: user._id }
                ],
                status: "accepted"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user1",
                foreignField: "_id",
                as: "user1"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user2",
                foreignField: "_id",
                as: "user2"
            }
        },
        {
            $unwind: "$user1"
        },
        {
            $unwind: "$user2"
        },
        {
            $project: {
                user: {
                    $cond: {
                        if: { $eq: ["$user1._id", user._id] },
                        then: "$user2",
                        else: "$user1"
                    }
                }
            }
        },
        {
            $project: {
                "user._id": 1,
                "user.fname": 1,
                "user.lname": 1,
                "user.email": 1,
                "user.logo": 1,
            }
        },
        {
            $match: {
                $or: [
                    { "user.fname": { $regex: queryString.search, $options: "i" } },
                    { "user.lname": { $regex: queryString.search, $options: "i" } },
                    { "user.email": { $regex: queryString.search, $options: "i" } }
                ]
            }
        },
    ];
    const friendsListAggregate = [
        ...sharedAggregate,
        {
            $skip: (queryString.page - 1) * queryString.pageSize
        },
        {
            $limit: queryString.pageSize
        }
    ];
    const totalLengthAggregate = [
        ...sharedAggregate,
        {
            $count: "totalLength"
        }
    ];
    const friendsList = yield friendShip_model_1.default.aggregate(friendsListAggregate);
    const friends = friendsList.map((friend) => friend.user);
    const totalLengthResult = yield friendShip_model_1.default.aggregate(totalLengthAggregate);
    const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;
    const response = {
        message: "Success",
        data: {
            result: friends,
            totalLength,
        },
    };
    res.status(200).json(response);
}));
exports.getFriendReceiveList = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const queryString = {
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 5,
        sort: req.query.sort || "-createdAt",
        search: req.query.search || "",
    };
    const sharedAggregate = [
        {
            $match: {
                user2: user._id,
                status: "pending"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user1",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                "user._id": 1,
                "user.fname": 1,
                "user.lname": 1,
                "user.email": 1,
                "user.logo": 1,
            }
        },
        {
            $match: {
                $or: [
                    { "user.fname": { $regex: queryString.search, $options: "i" } },
                    { "user.lname": { $regex: queryString.search, $options: "i" } },
                    { "user.email": { $regex: queryString.search, $options: "i" } }
                ]
            }
        },
    ];
    const friendsListAggregate = [
        ...sharedAggregate,
        {
            $skip: (queryString.page - 1) * queryString.pageSize
        },
        {
            $limit: queryString.pageSize
        }
    ];
    const totalLengthAggregate = [
        ...sharedAggregate,
        {
            $count: "totalLength"
        }
    ];
    const friendsList = yield friendShip_model_1.default.aggregate(friendsListAggregate);
    const friends = friendsList.map((friend) => friend.user);
    const totalLengthResult = yield friendShip_model_1.default.aggregate(totalLengthAggregate);
    const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;
    const response = {
        message: "Success",
        data: {
            result: friends,
            totalLength,
        },
    };
    res.status(200).json(response);
}));
exports.getFriendSendList = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const queryString = {
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 5,
        sort: req.query.sort || "-createdAt",
        search: req.query.search || "",
    };
    const sharedAggregate = [
        {
            $match: {
                user1: user._id,
                status: "pending"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user2",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                "user._id": 1,
                "user.fname": 1,
                "user.lname": 1,
                "user.email": 1,
                "user.logo": 1,
            }
        },
        {
            $match: {
                $or: [
                    { "user.fname": { $regex: queryString.search, $options: "i" } },
                    { "user.lname": { $regex: queryString.search, $options: "i" } },
                    { "user.email": { $regex: queryString.search, $options: "i" } }
                ]
            }
        },
    ];
    const friendsListAggregate = [
        ...sharedAggregate,
        {
            $skip: (queryString.page - 1) * queryString.pageSize
        },
        {
            $limit: queryString.pageSize
        }
    ];
    const totalLengthAggregate = [
        ...sharedAggregate,
        {
            $count: "totalLength"
        }
    ];
    const friendsList = yield friendShip_model_1.default.aggregate(friendsListAggregate);
    const friends = friendsList.map((friend) => friend.user);
    const totalLengthResult = yield friendShip_model_1.default.aggregate(totalLengthAggregate);
    const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;
    const response = {
        message: "Success",
        data: {
            result: friends,
            totalLength,
        },
    };
    res.status(200).json(response);
}));
exports.sendFriendRequest = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const friend = req.user;
    const friendShipData = {
        user1: user._id,
        user2: friend._id,
    };
    yield friendShip_model_1.default.create(friendShipData);
    socket_1.default.getIO().in(friend.socketId).emit("friendShip", {
        action: "friendRequest",
        data: user
    });
    const response = {
        message: "Success",
    };
    res.status(201).json(response);
}));
exports.acceptFriendRequest = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const friend = req.user;
    const friendShip = req.friendShip;
    friendShip.status = "accepted";
    yield friendShip.save();
    const chatData = {
        friendShip: friendShip._id
    };
    const chat = yield chat_model_1.default.create(chatData);
    const chatUser1 = {
        chat: chat._id,
        user: friendShip.user1,
        userRole: "user",
    };
    const chatUser2 = {
        chat: chat._id,
        user: friendShip.user2,
        userRole: "user",
    };
    yield chatUser_model_1.default.create(chatUser1);
    yield chatUser_model_1.default.create(chatUser2);
    socket_1.default.getIO().in(friend.socketId).emit("friendShip", {
        action: "acceptRequest",
        data: user
    });
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
exports.deleteOrRejectFriend = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const friendShip = req.friendShip;
    const user = req.authUser;
    const friend = req.user;
    yield friendShip_model_1.default.findOneAndDelete({ _id: friendShip._id });
    socket_1.default.getIO().in(friend.socketId).emit("friendShip", {
        action: "deleteRequest",
        data: user
    });
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
