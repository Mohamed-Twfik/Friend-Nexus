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
exports.deleteStatus = exports.createStatus = exports.getOneStatus = exports.getUserStatusList = void 0;
const status_model_1 = __importDefault(require("../models/status.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const socket_1 = __importDefault(require("../../socket"));
const friendShip_model_1 = __importDefault(require("../models/friendShip.model"));
const getUserStatusList = (to) => {
    return (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let user;
        if (to === "owner") {
            user = req.authUser;
        }
        else {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
            user = req.user;
        }
        const queryString = {
            page: +req.query.page,
            pageSize: +req.query.pageSize,
            sort: "-createdAt",
            search: req.query.search
        };
        const apiFeatures = new apiFeatures_1.default(status_model_1.default.find({ user: user._id }), queryString, { user: user._id })
            .search({
            content: { $regex: queryString.search, $options: "i" }
        })
            .sort()
            .paginate();
        const statuses = yield apiFeatures.get();
        const totalLength = yield apiFeatures.getTotal();
        const response = {
            message: "Success",
            data: {
                result: statuses,
                totalLength
            }
        };
        res.status(200).json(response);
    }));
};
exports.getUserStatusList = getUserStatusList;
exports.getOneStatus = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const status = req.status;
    const response = {
        message: "Success",
        data: status,
    };
    res.status(200).json(response);
}));
exports.createStatus = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const { content } = req.body;
    if (!content && !req.file)
        return next((0, errorMessage_1.default)(422, "Content or file is required"));
    const statusData = {
        user: user._id
    };
    if (req.file)
        statusData.file = req.file.filename;
    if (content)
        statusData.content = content;
    const status = yield status_model_1.default.create(statusData);
    const data = {
        action: "create",
        data: status
    };
    yield sendSocketEvent(user, data);
    const response = {
        message: "Success",
        data: status,
    };
    res.status(201).json(response);
}));
exports.deleteStatus = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const status = req.status;
    if (status.file) {
        const fileURL = path_1.default.join("uploads", status.file);
        fs_1.default.unlink(fileURL, (err) => {
            if (err)
                console.log(err);
        });
    }
    yield status.deleteOne();
    const data = {
        action: "delete",
        data: status
    };
    yield sendSocketEvent(user, data);
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
const sendSocketEvent = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    const friends = yield friendShip_model_1.default.find({
        status: "accepted", $or: [
            { user1: user._id },
            { user2: user._id }
        ]
    }).populate("user1").populate("user2");
    friends.forEach(friend => {
        const friendSocketId = friend.user1._id.toString() === user._id.toString() ? friend.user2.socketId : friend.user1.socketId;
        socket_1.default.getIO().in(friendSocketId).emit("status", data);
    });
});
