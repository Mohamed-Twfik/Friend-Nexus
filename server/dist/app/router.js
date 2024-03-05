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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const node_cron_1 = __importDefault(require("node-cron"));
const errorMessage_1 = __importDefault(require("./utils/errorMessage"));
// import swagger from '../swagger';
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const friend_router_1 = __importDefault(require("./routes/friend.router"));
const chat_router_1 = __importDefault(require("./routes/chat.router"));
const message_router_1 = __importDefault(require("./routes/message.router"));
const authentication_1 = __importDefault(require("./middlewares/Auth/authentication"));
const token_model_1 = __importDefault(require("./models/token.model"));
exports.default = (app) => {
    // Schedule a task to run every hour
    node_cron_1.default.schedule('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find and delete tokens that have expired
            yield token_model_1.default.deleteMany({ expireAt: { $lt: new Date() } });
        }
        catch (error) {
            console.error('Error deleting expired tokens:', error);
        }
    }));
    app.use("/auth", auth_router_1.default);
    app.use("/file", authentication_1.default, express_1.default.static(path_1.default.join(__dirname, "uploads")));
    app.use("/users", authentication_1.default, user_router_1.default);
    app.use("/friends", authentication_1.default, friend_router_1.default);
    app.use("/chats", authentication_1.default, chat_router_1.default);
    app.use("/messages", authentication_1.default, message_router_1.default);
    // swagger(app);
    // Not Found Page
    app.use((req, res, next) => {
        next((0, errorMessage_1.default)(404, `Not found - ${req.originalUrl}`));
    });
    // to catch any error
    app.use((error, req, res, next) => {
        res.status(error.status || 500).json(error);
    });
};
