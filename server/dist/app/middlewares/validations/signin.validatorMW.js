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
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = () => {
    return [
        (0, express_validator_1.body)("email")
            .trim()
            .isEmail().withMessage("Incorrect Email Or Password")
            .normalizeEmail()
            .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email: value });
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
