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
exports.userIdValidator = exports.codeValidator = exports.lnameValidator = exports.fnameValidator = exports.passwordValidator = exports.emailValidator = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../../models/user.model"));
const emailValidator = (message) => {
    return (0, express_validator_1.body)("email")
        .trim()
        .isEmail().withMessage(message)
        .normalizeEmail()
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.default.findOne({ email: value });
        if (!user)
            throw new Error(message);
        req.user = user;
    }));
};
exports.emailValidator = emailValidator;
const passwordValidator = (message, key = "password") => {
    return (0, express_validator_1.body)(key)
        .trim()
        .isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/).withMessage(message);
};
exports.passwordValidator = passwordValidator;
const fnameValidator = () => {
    return (0, express_validator_1.body)("fname")
        .trim()
        .isLength({ min: 2 }).withMessage("First Name must be at least 2 characters long")
        .escape();
};
exports.fnameValidator = fnameValidator;
const lnameValidator = () => {
    return (0, express_validator_1.body)("lname")
        .trim()
        .isLength({ min: 2 }).withMessage("Last Name must be at least 2 characters long")
        .escape();
};
exports.lnameValidator = lnameValidator;
const codeValidator = (key) => {
    return (0, express_validator_1.body)("code")
        .trim()
        .isLength({ min: 8 }).withMessage("Incorrect Email Or Code")
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user[key])
            throw new Error("Code Not Found");
        else if (user[key].code !== value)
            throw new Error("Incorrect Email Or Code");
        else if (user[key].expireAt < new Date())
            throw new Error("Code Expired");
    }));
};
exports.codeValidator = codeValidator;
const userIdValidator = () => {
    return (0, express_validator_1.param)("userId")
        .isMongoId()
        .withMessage("Invalid User Id")
        .bail()
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(value);
        if (!user)
            throw new Error("Invalid User Id");
        req.wantedUser = user;
    }));
};
exports.userIdValidator = userIdValidator;
