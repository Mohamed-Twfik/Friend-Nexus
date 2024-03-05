"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatUserSchema = new mongoose_1.default.Schema({
    userRole: {
        type: String,
        enum: ["admin", "moderator", "user"],
        default: "user"
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("ChatUser", chatUserSchema);
