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
        default: "default-logo.jpg"
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
    }
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isModified("password")) {
                this.password = bcrypt_1.default.hashSync(this.password, 8);
                this.changePasswordAt = new Date();
                yield this.model("token").deleteMany({ user: this._id });
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
// userSchema.pre(/^find/, async function () {
//   this.select({ __v: 0, code: 0, changePasswordAt: 0});
// });
exports.default = mongoose_1.default.model("User", userSchema);
