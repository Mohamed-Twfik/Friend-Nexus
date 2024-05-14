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
const user_model_1 = __importDefault(require("../models/user.model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const socket_1 = __importDefault(require("../../socket"));
exports.getUserChats = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const queryString = {
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 5,
        sort: "-createdAt",
        search: req.query.search || "",
    };
    const sharedAggregate = [
        {
            $match: {
                user: user._id
            }
        },
        {
            $lookup: {
                from: "chats",
                localField: "chat",
                foreignField: "_id",
                as: "chat"
            }
        },
        {
            $unwind: "$chat"
        },
        {
            $lookup: {
                from: "friendships",
                localField: "chat.friendShip",
                foreignField: "_id",
                as: "chat.friendShip"
            }
        },
        {
            $unwind: {
                path: "$chat.friendShip",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "chat.friendShip.user1",
                foreignField: "_id",
                as: "chat.friendShip.user1"
            }
        },
        {
            $unwind: {
                path: "$chat.friendShip.user1",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "chat.friendShip.user2",
                foreignField: "_id",
                as: "chat.friendShip.user2"
            }
        },
        {
            $unwind: {
                path: "$chat.friendShip.user2",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                $or: [
                    { "chat.name": { $regex: queryString.search, $options: "i" } },
                    { "chat.description": { $regex: queryString.search, $options: "i" } },
                    { "chat.friendShip.user1.fname": { $regex: queryString.search, $options: "i" } },
                    { "chat.friendShip.user1.lname": { $regex: queryString.search, $options: "i" } },
                    { "chat.friendShip.user1.email": { $regex: queryString.search, $options: "i" } },
                    { "chat.friendShip.user2.fname": { $regex: queryString.search, $options: "i" } },
                    { "chat.friendShip.user2.lname": { $regex: queryString.search, $options: "i" } },
                    { "chat.friendShip.user2.email": { $regex: queryString.search, $options: "i" } },
                ]
            }
        },
    ];
    const userChatsAggregate = [
        ...sharedAggregate,
        {
            $project: {
                updatedAt: 1,
                chat: {
                    _id: 1,
                    type: 1,
                    name: 1,
                    description: 1,
                    logo: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    friendShip: {
                        user1: {
                            _id: 1,
                            fname: 1,
                            lname: 1,
                            email: 1,
                            logo: 1,
                        },
                        user2: {
                            _id: 1,
                            fname: 1,
                            lname: 1,
                            email: 1,
                            logo: 1,
                        }
                    }
                },
            }
        },
        {
            $skip: (queryString.page - 1) * queryString.pageSize,
        },
        {
            $limit: queryString.pageSize,
        },
    ];
    const totalLengthAggregate = [
        ...sharedAggregate,
        {
            $count: "totalLength"
        }
    ];
    const userChats = yield chatUser_model_1.default.aggregate(userChatsAggregate);
    const totalLengthResult = yield chatUser_model_1.default.aggregate(totalLengthAggregate);
    const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;
    const chats = userChats.map((userChat) => {
        if (userChat.chat.type === "private") {
            let friend = {};
            if (userChat.chat.friendShip.user1._id.toString() === user._id.toString())
                friend = userChat.chat.friendShip.user2;
            else if (userChat.chat.friendShip.user2._id.toString() === user._id.toString())
                friend = userChat.chat.friendShip.user1;
            userChat.chat.name = `${friend.fname} ${friend.lname}`;
            userChat.chat.logo = `${friend.logo}`;
            userChat.chat.description = `${friend.fname} ${friend.lname} Friend Chat`;
        }
        userChat.chat.friendShip = undefined;
        return userChat.chat;
    });
    const response = {
        message: "Success",
        data: {
            result: chats,
            totalLength,
        },
    };
    res.status(200).json(response);
}));
exports.getOneChat = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    const user = req.authUser;
    if (chat.type === "private") {
        const friendShip = req.friendShip;
        let friend = {};
        if (friendShip.user1.toString() === user._id.toString()) {
            friend = (yield user_model_1.default.findById(friendShip.user2));
        }
        else if (friendShip.user2.toString() === user._id.toString()) {
            friend = (yield user_model_1.default.findById(friendShip.user1));
        }
        ;
        chat.name = `${friend.fname} ${friend.lname}`;
        chat.logo = `${friend.logo}`;
        delete chat.friendShip;
    }
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
    if (req.file)
        chatData.logo = req.file.filename;
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
    if (req.file) {
        if (chat.logo) {
            const fileURL = path_1.default.join("uploads", chat.logo);
            fs_1.default.unlink(fileURL, (err) => {
                if (err)
                    console.log(err);
            });
        }
        chat.logo = req.file.filename;
    }
    yield chat.save();
    const data = {
        action: "update",
        data: chat
    };
    yield sendEventToChatUsers(chat, data);
    const response = {
        message: "Success",
        data: chat,
    };
    res.status(202).json(response);
}));
exports.deleteChat = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    if (chat.logo) {
        const fileURL = path_1.default.join("uploads", chat.logo);
        fs_1.default.unlink(fileURL, (err) => {
            if (err)
                console.log(err);
        });
    }
    const chatUsers = yield chatUser_model_1.default.find({ chat: chat._id }).populate("user");
    yield chat_model_1.default.findOneAndDelete({ _id: chat._id });
    chatUsers.forEach(chatUser => {
        const user = chatUser.user;
        socket_1.default.getIO().in(user.socketId).emit("chat", {
            action: "delete",
            data: chat
        });
    });
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
exports.getChatUsers = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = req.chat;
    const queryString = {
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 5,
        search: req.query.search || "",
    };
    const sharedAggregate = [
        {
            $match: {
                chat: chat._id,
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user",
        },
        {
            $match: {
                user: { $ne: null },
                $or: [
                    { "user.fname": { $regex: queryString.search, $options: "i" } },
                    { "user.lname": { $regex: queryString.search, $options: "i" } },
                    { "user.email": { $regex: queryString.search, $options: "i" } },
                ]
            }
        },
    ];
    const totalLengthAggregate = [
        ...sharedAggregate,
        {
            $count: "totalLength"
        }
    ];
    const chatUsersAggregate = [
        ...sharedAggregate,
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
            $skip: (queryString.page - 1) * queryString.pageSize,
        },
        {
            $limit: queryString.pageSize,
        },
    ];
    const chatUsers = yield chatUser_model_1.default.aggregate(chatUsersAggregate);
    const totalLengthResult = yield chatUser_model_1.default.aggregate(totalLengthAggregate);
    const totalLength = totalLengthResult.length > 0 ? totalLengthResult[0].totalLength : 0;
    const users = chatUsers.map((chatUser) => chatUser.user);
    const response = {
        message: "Success",
        data: {
            result: users,
            totalLength,
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
    const data = {
        action: "addUser",
        data: user
    };
    yield sendEventToChatUsers(chat, data);
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
    const user = yield user_model_1.default.findById(chatUser.user);
    const chat = req.chat;
    const data = {
        action: "userRole",
        data: {
            user,
            role: chatUser.userRole
        }
    };
    socket_1.default.getIO().in(user.socketId).emit("chat", data);
    yield sendEventToChatUsers(chat, data);
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
    const user = yield user_model_1.default.findById(chatUser.user);
    const chat = req.chat;
    const data = {
        action: "removeUser",
        data: user
    };
    yield sendEventToChatUsers(chat, data);
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
            yield chat_model_1.default.findOneAndDelete({ _id: chat._id });
        else {
            chat.admin = firstChatUser._id;
            firstChatUser.userRole = "admin";
            yield chat.save();
            yield firstChatUser.save();
        }
        ;
    }
    ;
    yield chatUser.deleteOne();
    const user = yield user_model_1.default.findById(chatUser.user);
    const data = {
        action: "leaveChat",
        data: user
    };
    yield sendEventToChatUsers(chat, data);
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
const sendEventToChatUsers = (chat, data) => __awaiter(void 0, void 0, void 0, function* () {
    const chatUsers = yield chatUser_model_1.default.find({ chat: chat._id }).populate("user");
    chatUsers.forEach(chatUser => {
        const user = chatUser.user;
        socket_1.default.getIO().in(user.socketId).emit("chat", data);
    });
});
