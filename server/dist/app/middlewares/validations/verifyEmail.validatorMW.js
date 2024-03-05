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
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../../models/user.model"));
exports.default = () => {
    return [
        (0, express_validator_1.body)("email")
            .trim()
            .isEmail().withMessage("Incorrect Email Or Code")
            .normalizeEmail()
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email: value });
            if (!user)
                throw new Error("Incorrect Email Or Code");
            req.user = user;
        })),
        (0, express_validator_1.body)("code")
            .trim()
            .isLength({ min: 8 }).withMessage("Incorrect Email Or Code")
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = req.user;
            if (!user.emailVerificationCode)
                throw new Error("Email Already Verified");
            else if (user.emailVerificationCode.code !== value)
                throw new Error("Incorrect Email Or Code");
            else if (user.emailVerificationCode.expireAt < new Date())
                throw new Error("Code Expired");
        })),
    ];
};
