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
exports.newPasswordValidator = exports.resetPasswordValidator = exports.verifyEmailValidator = exports.signupValidator = exports.signinValidator = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../../models/user.model"));
const shared_validator_1 = require("./shared.validator");
const codeValidator = (key, message) => {
    return (0, express_validator_1.body)("code")
        .trim()
        .isLength({ min: 8 }).withMessage(message)
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user[key])
            throw new Error("Code Not Found");
        else if (user[key].code !== value)
            throw new Error(message);
        else if (new Date(user[key].expireAt).getTime() < new Date().getTime())
            throw new Error("Code Expired");
    }));
};
const signinValidator = () => {
    return [
        (0, shared_validator_1.emailValidator)("Incorrect Email Or Password", { password: 1, verified: 1 }),
        (0, shared_validator_1.passwordValidator)("Incorrect Email Or Password")
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.user;
            const match = yield bcrypt_1.default.compare(value, user.password);
            if (!match)
                throw new Error("Incorrect Email Or Password");
        })),
    ];
};
exports.signinValidator = signinValidator;
const signupValidator = () => {
    return [
        (0, express_validator_1.body)("email")
            .trim()
            .isEmail().withMessage("Invalid Email")
            .normalizeEmail()
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email: value });
            if (user)
                throw new Error("Email already exists");
        })),
        (0, shared_validator_1.passwordValidator)("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
        (0, shared_validator_1.fnameValidator)(),
        (0, shared_validator_1.lnameValidator)(),
    ];
};
exports.signupValidator = signupValidator;
const verifyEmailValidator = () => {
    return [
        (0, shared_validator_1.emailValidator)("Incorrect Email Or Code", { emailVerificationCode: 1 }),
        codeValidator("emailVerificationCode", "Incorrect Email Or Code"),
    ];
};
exports.verifyEmailValidator = verifyEmailValidator;
const resetPasswordValidator = () => {
    return [
        (0, shared_validator_1.emailValidator)("Email Not Found"),
    ];
};
exports.resetPasswordValidator = resetPasswordValidator;
const newPasswordValidator = () => {
    return [
        (0, shared_validator_1.emailValidator)("Incorrect Email Or Code", { resetPasswordCode: 1 }),
        codeValidator("resetPasswordCode", "Incorrect Email Or Code"),
        (0, shared_validator_1.passwordValidator)("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    ];
};
exports.newPasswordValidator = newPasswordValidator;
