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
exports.deleteToken = exports.getOneToken = exports.getUserTokens = void 0;
const express_validator_1 = require("express-validator");
const token_model_1 = __importDefault(require("../models/token.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
exports.getUserTokens = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const tokens = yield token_model_1.default.find({ user: user._id });
    const response = {
        message: "Success",
        data: {
            result: tokens,
            totalLength: tokens.length
        }
    };
    res.status(200).json(response);
}));
exports.getOneToken = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const token = req.token;
    const response = {
        message: "Success",
        data: token
    };
    res.status(200).json(response);
}));
exports.deleteToken = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Data", errors.array()));
    const token = req.token;
    yield token.deleteOne();
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
