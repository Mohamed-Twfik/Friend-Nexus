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
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const catchErrors_1 = __importDefault(require("../../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../../utils/errorMessage"));
dotenv_1.default.config();
exports.default = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // [1] check if send token
    let token = req.headers.authorization;
    if (!token)
        return next((0, errorMessage_1.default)(401, "Token required."));
    // [2] check if token valid or not
    let decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
    const user = yield user_model_1.default.findById(decoded.id);
    if (!user)
        return next((0, errorMessage_1.default)(401, "Invalid Token"));
    // [3] when user change password compare time
    if (user.changePasswordAt) {
        let changePasswordDate = user.changePasswordAt.getTime() / 1000;
        const iat = decoded.iat || 0;
        if (changePasswordDate > iat)
            return next((0, errorMessage_1.default)(401, "Password Changed"));
    }
    req.user = user;
    next();
}));
