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
exports.getOneUserPermission = exports.deleteUserPermission = void 0;
const express_validator_1 = require("express-validator");
const friendShip_model_1 = __importDefault(require("../models/friendShip.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
exports.deleteUserPermission = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Id", errors.array()));
    const user = req.user;
    const wantedUser = req.wantedUser;
    if (user.role === "admin" || user.role === "moderator" || user._id.toString() === wantedUser._id.toString())
        return next();
    next((0, errorMessage_1.default)(403, "You don't have permission to delete this user"));
}));
exports.getOneUserPermission = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next((0, errorMessage_1.default)(422, "Invalid Id", errors.array()));
    const user = req.user;
    if (user.role === "admin" || user.role === "moderator")
        return next();
    const friendship = yield friendShip_model_1.default.findOne({
        $or: [
            { $and: [{ user1: user._id }, { user2: req.params.userId }, { status: "accepted" }] },
            { $and: [{ user1: req.params.userId }, { user2: user._id }, { status: "accepted" }] },
        ],
    });
    if (!friendship)
        return next((0, errorMessage_1.default)(403, "You are not friend with this user"));
    req.friendship = friendship;
    next();
}));
