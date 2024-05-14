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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const user_model_1 = __importDefault(require("../models/user.model"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
const generateRandomCode_1 = __importDefault(require("../utils/generateRandomCode"));
const sendMails_1 = __importDefault(require("../utils/sendMails"));
const socket_1 = __importDefault(require("../../socket"));
exports.getAllUsers = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = {
        page: +req.query.page,
        pageSize: +req.query.pageSize,
        sort: "-createdAt",
        search: req.query.search,
    };
    const apiFeature = new apiFeatures_1.default(user_model_1.default.find(), queryString)
        .search({
        $or: [
            { fname: { $regex: queryString.search, $options: "i" } },
            { lname: { $regex: queryString.search, $options: "i" } },
            { email: { $regex: queryString.search, $options: "i" } },
        ]
    })
        .sort()
        .paginate();
    const users = yield apiFeature.get();
    const totalLength = yield apiFeature.getTotal();
    const response = {
        message: "Success",
        data: {
            result: users,
            totalLength,
        },
    };
    res.status(200).json(response);
}));
exports.getUser = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
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
    const user = req.authUser;
    user.fname = req.body.fname || user.fname;
    user.lname = req.body.lname || user.lname;
    if (req.file) {
        if (user.logo) {
            const fileURL = path_1.default.join('uploads', user.logo);
            fs_1.default.unlink(fileURL, (err) => {
                if (err)
                    console.log(err);
            });
        }
        user.logo = req.file.filename;
    }
    yield user.save();
    user.password = undefined;
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
    const user = req.authUser;
    user.password = req.body.password;
    yield user.save();
    user.password = undefined;
    const response = {
        message: "Success",
        data: user,
    };
    res.status(202).json(response);
}));
exports.updateRole = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const user = req.user;
    if (user.role === "admin")
        return next((0, errorMessage_1.default)(403, "Access Denied"));
    else if (user.role === "user")
        user.role = "moderator";
    else
        user.role = "user";
    yield user.save();
    user.password = undefined;
    socket_1.default.getIO().in(user.socketId).emit("user", {
        action: "updateRole",
        data: user.role
    });
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
    const user = req.authUser;
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
    const user = req.authUser;
    user.email = user.newEmail;
    user.newEmail = undefined;
    user.emailVerificationCode = undefined;
    yield user.save();
    user.password = undefined;
    const response = {
        message: "Success",
        data: user,
    };
    res.status(202).json(response);
}));
exports.deleteUser = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user.logo) {
        const fileURL = path_1.default.join("uploads", user.logo);
        fs_1.default.unlink(fileURL, (err) => {
            if (err)
                console.log(err);
        });
    }
    yield user_model_1.default.findOneAndDelete({ _id: user._id });
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
