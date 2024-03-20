"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStatusValidator = exports.statusIdValidator = void 0;
const express_validator_1 = require("express-validator");
const status_model_1 = __importDefault(require("../models/status.model"));
const shared_validator_1 = require("./shared.validator");
const statusIdValidator = () => {
    return [
        (0, shared_validator_1.mongoIdValidator)("status", status_model_1.default)
    ];
};
exports.statusIdValidator = statusIdValidator;
const createStatusValidator = () => {
    return [
        (0, express_validator_1.body)("content")
            .trim()
            .isLength({ min: 1, max: 1000 }).withMessage("Content must be between 1 to 1000 characters long")
            .escape()
            .optional()
    ];
};
exports.createStatusValidator = createStatusValidator;
