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
exports.signout = exports.newPassword = exports.resetPassword = exports.verifyEmail = exports.signup = exports.signin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const device_detector_js_1 = __importDefault(require("device-detector-js"));
const express_validator_1 = require("express-validator");
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const user_model_1 = __importDefault(require("../models/user.model"));
const token_model_1 = __importDefault(require("../models/token.model"));
const generateRandomCode_1 = __importDefault(require("../utils/generateRandomCode"));
const sendMails_1 = __importDefault(require("../utils/sendMails"));
dotenv_1.default.config();
const detector = new device_detector_js_1.default();
exports.signin = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors));
    const user = req.user;
    if (!user.verified)
        return next((0, errorMessage_1.default)(401, "Email Not Verified"));
    const userDevicesCount = yield token_model_1.default.find({ user: user._id }).countDocuments();
    if (userDevicesCount >= +process.env.MAX_DEVICES_ALLOWED)
        return next((0, errorMessage_1.default)(401, `Maximum ${process.env.MAX_DEVICES_ALLOWED} devices are allowed`));
    const clientData = detector.parse(req.header("user-agent"));
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const tokenData = {
        token,
        client: clientData.client,
        os: clientData.os,
        device: clientData.device,
        bot: clientData.bot,
        user: user._id
    };
    yield token_model_1.default.create(tokenData);
    const response = {
        message: "Login Success",
        data: {
            userId: user._id,
            token
        }
    };
    return res.status(200).json(response);
}));
exports.signup = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors));
    const { email, password, fname, lname } = req.body;
    const code = (0, generateRandomCode_1.default)(8);
    const to = email;
    const subject = "Verification Code";
    const message = `Your verification code is ${code}`;
    (0, sendMails_1.default)(to, subject, message);
    const userData = {
        email,
        password,
        fname,
        lname,
        emailVerificationCode: { code, expireAt: new Date(new Date().getTime() + 5 * 60000) }
    };
    const user = yield user_model_1.default.create(userData);
    const response = { message: "Please check your email for code" };
    return res.status(201).json(response);
}));
exports.verifyEmail = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors));
    const user = req.user;
    user.emailVerificationCode = undefined;
    user.verified = true;
    yield user.save();
    const response = { message: "Email Verified Successfully" };
    return res.status(202).json(response);
}));
exports.resetPassword = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors));
    const user = req.user;
    const code = (0, generateRandomCode_1.default)(8);
    const to = user.email;
    const subject = "Reset Password Code";
    const message = `Your reset password code is ${code}`;
    (0, sendMails_1.default)(to, subject, message);
    user.resetPasswordCode = {
        code,
        expireAt: new Date(new Date().getTime() + 5 * 60000)
    };
    yield user.save();
    const response = { message: "Please check your email for code" };
    return res.status(201).json(response);
}));
exports.newPassword = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors));
    const { password } = req.body;
    const user = req.user;
    user.password = password;
    user.resetPasswordCode = undefined;
    yield user.save();
    const response = { message: "Password reset Successfully" };
    return res.status(202).json(response);
}));
exports.signout = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const token = req.authToken;
    yield token_model_1.default.findOneAndDelete({ token: token, user: user._id });
    const response = { message: "Signout Success" };
    res.status(200).json(response);
}));
