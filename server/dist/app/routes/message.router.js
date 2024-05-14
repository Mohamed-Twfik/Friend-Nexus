"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const message_permission_1 = require("../middlewares/auth/message.permission");
const chat_validator_1 = require("../middlewares/validators/chat.validator");
const message_validator_1 = require("../middlewares/validators/message.validator");
const fileUpload_1 = __importDefault(require("../middlewares/fileUpload"));
const router = express_1.default.Router();
router.get("/list/:chatId", (0, chat_validator_1.chatIdValidator)(), message_permission_1.getAndAddChatMessagePermission, message_controller_1.getChatMessages);
router.post("/new/:chatId", (0, fileUpload_1.default)("media", "array", "files"), (0, message_validator_1.createMessageValidator)(), message_permission_1.getAndAddChatMessagePermission, message_controller_1.createMessage);
router.patch("/:messageId", (0, fileUpload_1.default)("media", "array", "files"), (0, message_validator_1.updateMessageValidator)(), message_permission_1.checkMessageOwner, message_controller_1.updateMessage);
router.delete("/:messageId", (0, message_validator_1.messageIdValidator)(), message_permission_1.deleteMessagePermission, message_controller_1.deleteMessage);
exports.default = router;
