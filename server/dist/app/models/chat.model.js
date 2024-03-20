"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    type: {
        type: String,
        enum: ["group", "private"],
        default: "private",
        required: true,
    },
    access: {
        type: String,
        enum: ["public", "private"],
        default: "private",
    },
    admin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    friendShip: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "FriendShip",
        index: true
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Chat", chatSchema);
