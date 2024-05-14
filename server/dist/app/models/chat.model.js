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
const mongoose_1 = __importDefault(require("mongoose"));
const chatUser_model_1 = __importDefault(require("./chatUser.model"));
const message_model_1 = __importDefault(require("./message.model"));
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
        unique: true,
    },
}, { timestamps: true });
chatSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield chatUser_model_1.default.deleteMany({ chat: doc._id });
        yield message_model_1.default.deleteMany({ chat: doc._id });
    });
});
exports.default = mongoose_1.default.model("Chat", chatSchema);
