"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdAndChatIdValidator = exports.updateChatValidator = exports.createChatValidator = exports.chatIdValidator = void 0;
const express_validator_1 = require("express-validator");
const chat_model_1 = __importDefault(require("../../models/chat.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const shared_validator_1 = require("./shared.validator");
const nameValidator = () => {
    return (0, express_validator_1.body)('name')
        .trim()
        .isString()
        .isLength({ min: 2 })
        .withMessage('Name must be a string with at least 2 characters long')
        .escape();
};
const descriptionValidator = () => {
    return (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isString()
        .isLength({ min: 10 })
        .withMessage('Description must be a string with at least 10 characters long')
        .escape();
};
const chatIdValidator = () => {
    return (0, shared_validator_1.mongoIdValidator)('chat', chat_model_1.default);
};
exports.chatIdValidator = chatIdValidator;
const createChatValidator = () => {
    return [
        nameValidator(),
        descriptionValidator(),
    ];
};
exports.createChatValidator = createChatValidator;
const updateChatValidator = () => {
    return [
        (0, exports.chatIdValidator)(),
        nameValidator().optional(),
        descriptionValidator(),
    ];
};
exports.updateChatValidator = updateChatValidator;
const userIdAndChatIdValidator = () => {
    return [
        (0, exports.chatIdValidator)(),
        (0, shared_validator_1.mongoIdValidator)('user', user_model_1.default),
    ];
};
exports.userIdAndChatIdValidator = userIdAndChatIdValidator;
