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
exports.checkChatAccess = exports.checkChatAdmin = exports.checkChatModerator = exports.checkChatMember = void 0;
const express_validator_1 = require("express-validator");
const chatUser_model_1 = __importDefault(require("../../models/chatUser.model"));
const catchErrors_1 = __importDefault(require("../../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../../utils/errorMessage"));
const checkChatMember = (userType) => {
    return (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
        const user = req[userType];
        const chat = req.chat;
        if (chat.type === "private")
            return next((0, errorMessage_1.default)(403, "Access Denied"));
        const chatUser = yield chatUser_model_1.default.findOne({ chat: chat._id, user: user._id });
        if (!chatUser)
            return next((0, errorMessage_1.default)(403, "Access Denied"));
        req.chatUser = chatUser;
        next();
    }));
};
exports.checkChatMember = checkChatMember;
exports.checkChatModerator = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const chat = req.chat;
    if (chat.type === "private")
        return next((0, errorMessage_1.default)(403, "Access Denied"));
    const chatUser = yield chatUser_model_1.default.findOne({ chat: chat._id, user: user._id, userRole: { $ne: "user" } });
    if (!chatUser)
        return next((0, errorMessage_1.default)(403, "Access Denied"));
    next();
}));
exports.checkChatAdmin = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const chat = req.chat;
    if (chat.type === "private")
        return next((0, errorMessage_1.default)(403, "Access Denied"));
    const chatUser = yield chatUser_model_1.default.findOne({ chat: chat._id, user: user._id, userRole: "admin" });
    if (!chatUser)
        return next((0, errorMessage_1.default)(403, "Access Denied"));
    next();
}));
exports.checkChatAccess = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.authUser;
    const chat = req.chat;
    if (chat.type === "private" || chat.access === "private")
        return next((0, errorMessage_1.default)(403, "Access Denied"));
    req.user = user;
    next();
}));
