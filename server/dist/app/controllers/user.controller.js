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
exports.deleteUser = exports.verifyNewEmail = exports.requestUpdateEmail = exports.updateRole = exports.updatePassword = exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
const generateRandomCode_1 = __importDefault(require("../utils/generateRandomCode"));
const sendMails_1 = __importDefault(require("../utils/sendMails"));
exports.getAllUsers = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.query.fields = "-createdAt -updatedAt";
    const apiFeature = new apiFeatures_1.default(user_model_1.default.find(), req.query)
        .paginate()
        .filter()
        .fields()
        .search({
        $or: [
            { fname: { $regex: req.query.search, $options: "i" } },
            { lname: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    })
        .sort();
    const result = yield apiFeature.get();
    const total = result.length;
    const response = {
        message: "Success",
        data: {
            result,
            total,
        },
    };
    res.status(200).json(response);
}));
exports.getUser = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.wantedUser;
    const response = {
        message: "Success",
        data: user,
    };
    res.status(200).json(response);
}));
exports.updateUser = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.user;
    user.fname = req.body.fname || user.fname;
    user.lname = req.body.lname || user.lname;
    yield user.save();
    const response = {
        message: "Success",
        data: user,
    };
    res.status(202).json(response);
}));
exports.updatePassword = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.user;
    user.password = req.body.password;
    yield user.save();
    delete user.password;
    const response = {
        message: "Success",
        data: user,
    };
    res.status(202).json(response);
}));
exports.updateRole = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Id", errors.array()));
    const user = req.wantedUser;
    if (user.role === "admin")
        return next((0, errorMessage_1.default)(403, "You can't change admin role"));
    else if (user.role === "user")
        user.role = "moderator";
    else
        user.role = "user";
    yield user.save();
    const response = {
        message: "Success",
        data: user,
    };
    res.status(200).json(response);
}));
exports.requestUpdateEmail = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.user;
    const email = req.body.email;
    const code = (0, generateRandomCode_1.default)(8);
    const to = email;
    const subject = "Verification Code";
    const message = `Your verification code is ${code}`;
    (0, sendMails_1.default)(to, subject, message);
    user.emailVerificationCode = {
        code,
        expireAt: new Date(new Date().getTime() + 5 * 60000),
    };
    user.newEmail = email;
    yield user.save();
    const response = { message: "Please check new email address for the code" };
    res.status(200).json(response);
}));
exports.verifyNewEmail = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.user;
    user.email = user.newEmail;
    user.newEmail = undefined;
    user.emailVerificationCode = undefined;
    yield user.save();
    const response = {
        message: "Success",
        data: user,
    };
    res.status(202).json(response);
}));
exports.deleteUser = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.wantedUser;
    yield user.deleteOne();
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
