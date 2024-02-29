"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const errorMessage_1 = __importDefault(require("./utils/errorMessage"));
// import swagger from '../swagger';
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const friend_router_1 = __importDefault(require("./routes/friend.router"));
const chat_router_1 = __importDefault(require("./routes/chat.router"));
const message_router_1 = __importDefault(require("./routes/message.router"));
const authentication_1 = __importDefault(require("./middlewares/Auth/authentication"));
exports.default = (app) => {
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
        const { message, status } = error;
        res.status(status || 500).json({ message, status });
    });
};
