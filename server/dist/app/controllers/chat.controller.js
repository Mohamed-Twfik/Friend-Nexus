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
exports.leaveChat = exports.removeChatUser = exports.updateChatUserRole = exports.addChatUser = exports.getChatUsers = exports.deleteChat = exports.updateChat = exports.createChat = exports.getOneChat = exports.getUserChats = void 0;
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const chat_model_1 = __importDefault(require("../models/chat.model"));
const chatUser_model_1 = __importDefault(require("../models/chatUser.model"));
const express_validator_1 = require("express-validator");
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const user_model_1 = __importDefault(require("../models/user.model"));
exports.getUserChats = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const queryString = {
        page: req.query.page,
        pageSize: req.query.pageSize,
        sort: "-createdAt",
    };
    const apiFeatures = new apiFeatures_1.default(chatUser_model_1.default.find({ user: user._id }).populate("chat"), queryString)
        .paginate()
        .sort();
    const userChats = yield apiFeatures.get();
    const chats = userChats.map((userChat) => __awaiter(void 0, void 0, void 0, function* () {
        if (userChat.chat.type === "private") {
            const friendShip = userChat.chat.friendShip;
            let friend = {};
            if (friendShip.user1.toString() === user._id.toString()) {
                friend = (yield user_model_1.default.findById(friendShip.user2));
            }
            else if (friendShip.user2.toString() === user._id.toString()) {
                friend = (yield user_model_1.default.findById(friendShip.user1));
            }
            ;
            userChat.chat.name = `${friend.fname} ${friend.lname}`;
            userChat.chat.logo = `${friend.logo}`;
        }
        ;
        return userChat.chat;
    }));
    const total = userChats.length;
    const response = {
        message: "Success",
        data: {
            result: chats,
            total,
        },
    };
    res.status(200).json(response);
}));
exports.getOneChat = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    const response = {
        message: "Success",
        data: chat,
    };
    res.status(200).json(response);
}));
exports.createChat = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const { name, description, access } = req.body;
    const chatData = {
        type: "group",
        name: name,
        access: access || "private",
        description: description || `Chat group for ${name}`,
        admin: user._id
    };
    const chat = yield chat_model_1.default.create(chatData);
    const chatUserData = {
        userRole: "admin",
        user: user._id,
        chat: chat._id
    };
    const chatUser = yield chatUser_model_1.default.create(chatUserData);
    const response = {
        message: "Success",
        data: chat
    };
    res.status(201).json(response);
}));
exports.updateChat = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    const { name, description } = req.body;
    chat.name = name || chat.name;
    chat.description = description || chat.description;
    yield chat.save();
    const response = {
        message: "Success",
        data: chat,
    };
    res.status(202).json(response);
}));
exports.deleteChat = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    yield chat.deleteOne();
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
exports.getChatUsers = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    const queryString = {
        page: req.query.page,
        pageSize: req.query.pageSize,
    };
    const apiFeatures = new apiFeatures_1.default(chatUser_model_1.default.find({ chat: chat._id }).populate("user"), queryString)
        .paginate();
    const chatUsers = yield apiFeatures.get();
    const users = chatUsers.map((chatUser) => chatUser.user);
    const total = chatUsers.length;
    const response = {
        message: "Success",
        data: {
            result: users,
            total,
        },
    };
    res.status(200).json(response);
}));
exports.addChatUser = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    const user = req.user;
    const chatUser = yield chatUser_model_1.default.findOne({ chat: chat._id, user: user._id });
    if (chatUser)
        return next((0, errorMessage_1.default)(409, "User Already In Chat"));
    const chatUserData = {
        userRole: "user",
        user: user._id,
        chat: chat._id
    };
    const newChatUser = yield chatUser_model_1.default.create(chatUserData);
    const response = {
        message: "Success",
    };
    res.status(201).json(response);
}));
exports.updateChatUserRole = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chatUser = req.chatUser;
    if (chatUser.userRole === "admin")
        return next((0, errorMessage_1.default)(403, "Access Denied"));
    else if (chatUser.userRole === "moderator")
        chatUser.userRole = "user";
    else
        chatUser.userRole = "moderator";
    yield chatUser.save();
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
exports.removeChatUser = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chatUser = req.chatUser;
    if (chatUser.userRole === "admin")
        return next((0, errorMessage_1.default)(403, "Access Denied"));
    yield chatUser.deleteOne();
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
exports.leaveChat = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    const chatUser = req.chatUser;
    if (chatUser.userRole === "admin") {
        const firstChatUser = yield chatUser_model_1.default.findOne({ chat: chat._id });
        if (!firstChatUser)
            yield chat.deleteOne();
        else
            firstChatUser.userRole = "admin";
    }
    ;
    yield chatUser.deleteOne();
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
