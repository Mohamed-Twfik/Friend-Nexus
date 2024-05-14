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
exports.deleteMessage = exports.updateMessage = exports.createMessage = exports.getChatMessages = void 0;
const message_model_1 = __importDefault(require("../models/message.model"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const socket_1 = __importDefault(require("../../socket"));
const friendShip_model_1 = __importDefault(require("../models/friendShip.model"));
const chatUser_model_1 = __importDefault(require("../models/chatUser.model"));
const chat_model_1 = __importDefault(require("../models/chat.model"));
exports.getChatMessages = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    const search = req.query.search;
    const queryString = {
        page: +req.query.page,
        pageSize: +req.query.pageSize,
        sort: "-createdAt",
        search: search,
    };
    const apiFeature = new apiFeatures_1.default(message_model_1.default.find({ chat: chat._id }).populate("user"), queryString, { chat: chat._id })
        .sort()
        .search({
        content: { $regex: search, $options: "i" }
    })
        .paginate();
    const messages = yield apiFeature.get();
    const total = yield apiFeature.getTotal();
    const response = {
        message: "Success",
        data: {
            results: messages,
            total,
        },
    };
    res.status(200).json(response);
}));
exports.createMessage = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const chat = req.chat;
    const { content } = req.body;
    const files = req.files;
    if (!content && files.length === 0)
        return next((0, errorMessage_1.default)(422, "Content or files is required"));
    const messageData = {
        user: user._id,
        chat: chat._id,
    };
    if (files.length !== 0)
        messageData.files = files.map(file => file.filename);
    if (content)
        messageData.content = content;
    const message = yield message_model_1.default.create(messageData);
    const data = {
        action: "create",
        data: {
            message,
            chat: chat._id,
        },
    };
    yield sendSocketEvent(chat, user, data);
    const response = {
        message: "Success",
        data: message,
    };
    res.status(201).json(response);
}));
exports.updateMessage = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message = req.message;
    const user = req.authUser;
    const { content } = req.body;
    const files = req.files;
    message.content = content || message.content;
    if (files && files.length !== 0) {
        if (message.files && message.files.length !== 0) {
            message.files.forEach((file) => {
                const fileURL = path_1.default.join("uploads", file);
                fs_1.default.unlink(fileURL, (err) => {
                    if (err)
                        console.log(err);
                });
            });
        }
        message.files = files.map(file => file.filename);
    }
    yield message.save();
    const data = {
        action: "update",
        data: message
    };
    const chat = yield chat_model_1.default.findById(message.chat);
    yield sendSocketEvent(chat, user, data);
    const response = {
        message: "Success",
        data: message,
    };
    res.status(202).json(response);
}));
exports.deleteMessage = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message = req.message;
    const user = req.authUser;
    const chat = req.chat;
    if (message.files.length !== 0) {
        message.files.forEach((file) => {
            const fileURL = path_1.default.join("uploads", file);
            fs_1.default.unlink(fileURL, (err) => {
                if (err)
                    console.log(err);
            });
        });
    }
    ;
    yield message.deleteOne();
    const data = {
        action: "delete",
        data: {
            message,
            chat: chat._id,
        },
    };
    yield sendSocketEvent(chat, user, data);
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
const sendSocketEvent = (chat, user, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (chat.friendShip) {
        const friendShip = yield friendShip_model_1.default.findById(chat.friendShip).populate("user1").populate("user2");
        const friend = ((friendShip === null || friendShip === void 0 ? void 0 : friendShip.user1._id.toString()) === user._id.toString()) ? friendShip === null || friendShip === void 0 ? void 0 : friendShip.user2 : friendShip === null || friendShip === void 0 ? void 0 : friendShip.user1;
        socket_1.default.getIO().in(friend.socketId).emit("message", data);
    }
    else {
        const users = yield chatUser_model_1.default.find({ chat: chat._id }).populate("user");
        users.forEach((chatUser) => {
            socket_1.default.getIO().in(chatUser.user.socketId).emit("message", data);
        });
    }
});
