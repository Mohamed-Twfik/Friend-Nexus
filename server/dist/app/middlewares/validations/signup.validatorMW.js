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
