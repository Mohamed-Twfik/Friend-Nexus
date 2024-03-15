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
exports.deleteOrRejectFriend = exports.acceptFriendRequest = exports.sendFriendRequest = exports.getFriendSendList = exports.getFriendRequestList = exports.getFriendList = void 0;
const friendShip_model_1 = __importDefault(require("../models/friendShip.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const express_validator_1 = require("express-validator");
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
exports.getFriendList = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const search = req.query.search + "" || "";
    const queryString = {
        page: req.query.page,
        pageSize: req.query.pageSize,
        sort: req.query.sort || "-createdAt",
    };
    const apiFeature = new apiFeatures_1.default(friendShip_model_1.default.find({
        $and: [
            { status: "accepted" },
            { $or: [
                    { user1: user._id },
                    { user2: user._id }
                ]
            }
        ]
    }).populate({
        path: "user1",
        select: "-password -changePasswordAt -__v"
    }).populate({
        path: "user2",
        select: "-password -changePasswordAt -__v"
    }), queryString)
        .paginate()
        .sort();
    const friendShips = yield apiFeature.get();
    const friendList = friendShips.map((friendShip) => {
        const regex = new RegExp(search, "i");
        const user1 = friendShip.user1;
        const user2 = friendShip.user2;
        if (user1._id.toString() === user._id.toString()) {
            if (req.query.search) {
                if ((regex.test(user2.fname) || regex.test(user2.lname) || regex.test(user2.email)))
                    return user2;
            }
            else
                return user2;
        }
        else {
            if (req.query.search) {
                if ((regex.test(user1.fname) || regex.test(user1.lname) || regex.test(user1.email)))
                    return user1;
            }
            else
                return user1;
        }
    });
    const response = {
        message: "Success",
        data: friendList,
    };
    res.status(200).json(response);
}));
exports.getFriendRequestList = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const queryString = {
        page: req.query.page,
        pageSize: req.query.pageSize,
        sort: req.query.sort || "-createdAt",
    };
    const apiFeature = new apiFeatures_1.default(friendShip_model_1.default.find({
        $and: [
            { status: "pending" },
            { user2: user._id }
        ]
    }).populate("user1"), queryString)
        .paginate()
        .sort();
    const friendShips = yield apiFeature.get();
    const friendRequestList = friendShips.map((friendShip) => friendShip.user1);
    const response = {
        message: "Success",
        data: friendRequestList,
    };
    res.status(200).json(response);
}));
exports.getFriendSendList = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const search = req.query.search + "" || "";
    const queryString = {
        page: req.query.page,
        pageSize: req.query.pageSize,
        sort: req.query.sort || "-createdAt",
    };
    const apiFeature = new apiFeatures_1.default(friendShip_model_1.default.find({
        $and: [
            { status: "pending" },
            { user1: user._id }
        ]
    }).populate("user2"), queryString)
        .paginate()
        .sort();
    const friendShips = yield apiFeature.get();
    console.log(friendShips);
    const friendSendList = friendShips.map((friendShip) => friendShip.user2);
    const response = {
        message: "Success",
        data: friendSendList,
    };
    res.status(200).json(response);
}));
exports.sendFriendRequest = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.user;
    const friend = req.wantedUser;
    const friendShipData = {
        user1: user._id,
        user2: friend._id,
    };
    yield friendShip_model_1.default.create(friendShipData);
    const response = {
        message: "Success",
    };
    res.status(201).json(response);
}));
exports.acceptFriendRequest = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const friendShip = req.friendShip;
    friendShip.status = "accepted";
    yield friendShip.save();
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
    yield friendShip.deleteOne();
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
