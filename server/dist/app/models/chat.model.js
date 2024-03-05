"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
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
        required: true,
    },
    admin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Chat", chatSchema);
