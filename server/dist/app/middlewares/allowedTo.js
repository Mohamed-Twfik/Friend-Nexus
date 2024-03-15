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
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
const allowedTo = (...roles) => {
    if (roles.length === 0)
        roles = ["admin", "moderator", "user"];
    return (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!roles.includes(req.user.role))
            return next((0, errorMessage_1.default)(401, `Not Authorized To Access This Route You Are ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role}`));
        next();
    }));
};
exports.default = allowedTo;
