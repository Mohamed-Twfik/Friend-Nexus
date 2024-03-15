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
exports.verifyNewEmailValidator = exports.requestUpdateEmailValidator = exports.updatePasswordValidator = exports.updateUserValidator = exports.validUserId = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const shared_validator_1 = require("./shared.validator");
const express_validator_1 = require("express-validator");
const validUserId = () => {
    return [(0, shared_validator_1.userIdValidator)()];
};
exports.validUserId = validUserId;
const updateUserValidator = () => {
    return [
        (0, shared_validator_1.fnameValidator)().optional(),
        (0, shared_validator_1.lnameValidator)().optional(),
    ];
};
exports.updateUserValidator = updateUserValidator;
const updatePasswordValidator = () => {
    return [
        (0, shared_validator_1.passwordValidator)("Incorrect Old Password", "oldPassword")
            .bail({ level: "request" })
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(req.user._id).select({ password: 1 });
            const match = yield bcrypt_1.default.compare(value, (user === null || user === void 0 ? void 0 : user.password) || "");
            if (!match)
                throw new Error("Incorrect Old Password");
        }))
            .bail({ level: "request" }),
        (0, shared_validator_1.passwordValidator)("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    ];
};
exports.updatePasswordValidator = updatePasswordValidator;
const requestUpdateEmailValidator = () => {
    return [
        (0, express_validator_1.body)("email")
            .trim()
            .isEmail().withMessage("Invalid Email")
            .normalizeEmail()
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email: value });
            if (user)
                throw new Error("Email Already Exists");
        })),
    ];
};
exports.requestUpdateEmailValidator = requestUpdateEmailValidator;
const verifyNewEmailValidator = () => {
    return [
        (0, express_validator_1.body)("code")
            .trim()
            .isLength({ min: 8 }).withMessage("Invalid Code")
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.user;
            if (!user.newEmail)
                throw new Error("Please request to update email first");
            else if (user.emailVerificationCode.code !== value)
                throw new Error("Invalid Code");
            else if (user.emailVerificationCode.expireAt < new Date())
                throw new Error("Code Expired");
        }))
    ];
};
exports.verifyNewEmailValidator = verifyNewEmailValidator;
