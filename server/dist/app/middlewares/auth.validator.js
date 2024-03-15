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
const user_model_1 = __importDefault(require("../models/user.model"));
const signinValidator = () => {
    return [
        (0, express_validator_1.body)("email")
            .trim()
            .isEmail().withMessage("Incorrect Email Or Password")
            .normalizeEmail()
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email: value }).select({ password: 1, verified: 1 });
            if (!user)
                throw new Error("Incorrect Email Or Password");
            req.user = user;
        })),
        (0, express_validator_1.body)("password")
            .trim()
            .isLength({ min: 8 })
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/).withMessage("Incorrect Email Or Password")
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
        (0, express_validator_1.body)("password")
            .trim()
            .isLength({ min: 8 })
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/).withMessage("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
        (0, express_validator_1.body)("fname")
            .trim()
            .isLength({ min: 2 }).withMessage("First Name must be at least 2 characters long")
            .escape(),
        (0, express_validator_1.body)("lname")
            .trim()
            .isLength({ min: 2 }).withMessage("Last Name must be at least 2 characters long")
            .escape(),
    ];
};
exports.signupValidator = signupValidator;
const verifyEmailValidator = () => {
    return [
        (0, express_validator_1.body)("email")
            .trim()
            .isEmail().withMessage("Incorrect Email Or Code")
            .normalizeEmail()
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email: value }).select({ emailVerificationCode: 1 });
            if (!user)
                throw new Error("Incorrect Email Or Code");
            req.user = user;
        })),
        (0, express_validator_1.body)("code")
            .trim()
            .isLength({ min: 8 }).withMessage("Incorrect Email Or Code")
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.user;
            console.log(user);
            if (!user.emailVerificationCode)
                throw new Error("Email Already Verified");
            else if (user.emailVerificationCode.code !== value)
                throw new Error("Incorrect Email Or Code");
            else if (new Date(user.emailVerificationCode.expireAt).getTime() < new Date().getTime())
                throw new Error("Code Expired");
        })),
    ];
};
exports.verifyEmailValidator = verifyEmailValidator;
const resetPasswordValidator = () => {
    return [
        (0, express_validator_1.body)("email")
            .trim()
            .isEmail().withMessage("Email Not Found")
            .normalizeEmail()
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email: value });
            if (!user)
                throw new Error("Email Not Found");
            req.user = user;
        }))
    ];
};
exports.resetPasswordValidator = resetPasswordValidator;
const newPasswordValidator = () => {
    return [
        (0, express_validator_1.body)("email")
            .trim()
            .isEmail().withMessage("Incorrect Email Or Code")
            .normalizeEmail()
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email: value }).select({ resetPasswordCode: 1 });
            if (!user)
                throw new Error("Incorrect Email Or Code");
            req.user = user;
        })),
        (0, express_validator_1.body)("code")
            .trim()
            .isLength({ min: 8 }).withMessage("Incorrect Email Or Code")
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.user;
            if (!user.resetPasswordCode)
                throw new Error("Email Already Verified");
            else if (user.resetPasswordCode.code !== value)
                throw new Error("Incorrect Email Or Code");
            else if (user.resetPasswordCode.expireAt < new Date())
                throw new Error("Code Expired");
        })),
        (0, express_validator_1.body)("password")
            .trim()
            .isLength({ min: 8 }).withMessage("password must be at least 8 characters long")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/).withMessage("password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
    ];
};
exports.newPasswordValidator = newPasswordValidator;
