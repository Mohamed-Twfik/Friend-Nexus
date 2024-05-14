"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenIdValidator = void 0;
const token_model_1 = __importDefault(require("../../models/token.model"));
const shared_validator_1 = require("./shared.validator");
const tokenIdValidator = () => {
    return (0, shared_validator_1.mongoIdValidator)("token", token_model_1.default);
};
exports.tokenIdValidator = tokenIdValidator;
