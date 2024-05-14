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
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_model_1 = __importDefault(require("./token.model"));
const status_model_1 = __importDefault(require("./status.model"));
const message_model_1 = __importDefault(require("./message.model"));
const friendShip_model_1 = __importDefault(require("./friendShip.model"));
const chatUser_model_1 = __importDefault(require("./chatUser.model"));
const chat_model_1 = __importDefault(require("./chat.model"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "moderator", "user"],
        default: "user"
    },
    logo: {
        type: String,
    },
    changePasswordAt: {
        type: Date,
        default: new Date()
    },
    emailVerificationCode: {
        code: {
            type: String,
        },
        expireAt: {
            type: Date,
        }
    },
    resetPasswordCode: {
        code: {
            type: String,
        },
        expireAt: {
            type: Date,
        }
    },
    newEmail: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    socketId: String
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isModified("password")) {
                this.password = bcrypt_1.default.hashSync(this.password, 8);
                this.changePasswordAt = new Date();
                yield this.model("Token").deleteMany({ user: this._id });
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
userSchema.pre(/^find/, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.select({ __v: 0, password: 0, changePasswordAt: 0, emailVerificationCode: 0, resetPasswordCode: 0, newEmail: 0, verified: 0 });
    });
});
userSchema.post('findOneAndDelete', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield token_model_1.default.deleteMany({ user: doc._id });
        const friendShips = yield friendShip_model_1.default.find({
            $or: [
                { user1: doc._id },
                { user2: doc._id }
            ]
        });
        for (const friendShip of friendShips) {
            yield friendShip_model_1.default.findOneAndDelete({ _id: friendShip._id });
        }
        yield status_model_1.default.deleteMany({ user: doc._id });
        yield message_model_1.default.updateMany({ user: doc._id }, { user: null });
        yield chatUser_model_1.default.deleteMany({ user: doc._id, userRole: { $ne: "admin" } });
        const chats = yield chat_model_1.default.find({ admin: doc._id });
        for (const chat of chats) {
            const firstMember = yield chatUser_model_1.default.findOne({ chat: chat._id });
            // if (!firstMember) await chat.deleteOne();
            if (!firstMember)
                yield chat_model_1.default.findOneAndDelete({ _id: chat._id });
            else {
                chat.admin = firstMember._id;
                firstMember.userRole = "admin";
                yield chat.save();
                yield firstMember.save();
                yield chatUser_model_1.default.deleteOne({ user: doc._id, chat: chat._id });
            }
        }
    });
});
exports.default = mongoose_1.default.model("User", userSchema);
