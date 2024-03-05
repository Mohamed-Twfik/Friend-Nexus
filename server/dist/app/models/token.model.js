"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        unique: true,
        required: true
    },
    client: {
        clientName: {
            type: String
        },
        clientType: {
            type: String
        },
        clientVersion: {
            type: String
        },
        clientEngine: {
            type: String
        },
        clientEngineVersion: {
            type: String
        },
    },
    os: {
        osName: {
            type: String
        },
        osVersion: {
            type: String
        },
        osPlatform: {
            type: String
        },
    },
    device: {
        deviceType: {
            type: String
        },
        deviceBrand: {
            type: String
        },
        deviceModel: {
            type: String
        },
    },
    bot: {
        type: String
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Token", tokenSchema);
