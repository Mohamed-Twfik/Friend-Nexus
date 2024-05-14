"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMessageValidator = exports.createMessageValidator = exports.messageIdValidator = void 0;
const express_validator_1 = require("express-validator");
const message_model_1 = __importDefault(require("../../models/message.model"));
const chat_validator_1 = require("./chat.validator");
const shared_validator_1 = require("./shared.validator");
const contentValidator = () => {
    return (0, express_validator_1.body)("content")
        .trim()
        .isString()
        .isLength({ min: 1 }).withMessage("Message content must be a string with at least 1 characters long")
        .escape()
        .optional();
};
const messageIdValidator = () => {
    return (0, shared_validator_1.mongoIdValidator)("message", message_model_1.default);
};
exports.messageIdValidator = messageIdValidator;
const createMessageValidator = () => {
    return [
        (0, chat_validator_1.chatIdValidator)(),
        contentValidator()
    ];
};
exports.createMessageValidator = createMessageValidator;
const updateMessageValidator = () => {
    return [
        (0, exports.messageIdValidator)(),
        contentValidator()
    ];
};
exports.updateMessageValidator = updateMessageValidator;
