"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const statusSchema = new mongoose_1.default.Schema({
    file: {
        type: String
    },
    content: {
        type: String,
    },
    expireAt: {
        type: Date,
        default: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Status", statusSchema);
