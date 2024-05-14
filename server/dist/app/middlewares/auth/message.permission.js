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
exports.deleteMessagePermission = exports.checkMessageOwner = exports.getAndAddChatMessagePermission = void 0;
const express_validator_1 = require("express-validator");
const chat_model_1 = __importDefault(require("../../models/chat.model"));
const chatUser_model_1 = __importDefault(require("../../models/chatUser.model"));
const friendShip_model_1 = __importDefault(require("../../models/friendShip.model"));
const catchErrors_1 = __importDefault(require("../../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../../utils/errorMessage"));
exports.getAndAddChatMessagePermission = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const chat = req.chat;
    if (chat.type === "private") {
        const friendShip = yield friendShip_model_1.default.findOne({ _id: chat.friendShip, $or: [{ user1: user._id }, { user2: user._id }] });
        if (!friendShip)
            return next((0, errorMessage_1.default)(403, "Access Denied"));
    }
    else {
        const chatUser = yield chatUser_model_1.default.findOne({ chat: chat._id, user: user._id });
        if (!chatUser)
            return next((0, errorMessage_1.default)(403, "Access Denied"));
    }
    next();
}));
exports.checkMessageOwner = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const message = req.message;
    if (message.user.toString() !== user._id.toString())
        return next((0, errorMessage_1.default)(403, "Access Denied."));
    next();
}));
exports.deleteMessagePermission = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const message = req.message;
    const chat = yield chat_model_1.default.findById(message.chat);
    if (chat.type === "private") {
        if (message.user.toString() !== user._id.toString())
            return next((0, errorMessage_1.default)(403, "Access Denied."));
    }
    else {
        if (message.user.toString() !== user._id.toString() && chat.admin.toString() !== user._id.toString())
            return next((0, errorMessage_1.default)(403, "Access Denied."));
    }
    req.chat = chat;
    next();
}));
