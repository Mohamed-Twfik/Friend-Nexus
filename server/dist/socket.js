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
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("./app/models/user.model"));
const token_model_1 = __importDefault(require("./app/models/token.model"));
let io;
exports.default = {
    init: (httpServer) => {
        const io = new socket_io_1.Server(httpServer, { /* options */});
        io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("user connected");
            console.log(socket);
            try {
                const user = yield getUserFromSocket(socket);
                user.socketId = socket.id;
                yield user.save();
                socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("user disconnected");
                    console.log(socket);
                    user.socketId = undefined;
                    yield user.save();
                }));
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        }));
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized");
        }
        return io;
    }
};
/**
 * function for validate the token and get the userId from it
 * @param socket the socket object of the io connection
 * @returns user => user document of the token of the socket
 */
const getUserFromSocket = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    // [1] check if send token
    const token = socket.handshake.headers.authorization;
    if (!token)
        throw new Error("Token Required.");
    // [2] check if token valid or not
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
    const user = yield user_model_1.default.findById(decoded.id).select({ password: 0, emailVerificationCode: 1 });
    const tokenData = yield token_model_1.default.findOne({ token, user: user === null || user === void 0 ? void 0 : user._id });
    if (!user || !tokenData)
        throw new Error("Invalid Token.");
    // [3] when user change password compare time
    if (user.changePasswordAt) {
        let changePasswordDate = user.changePasswordAt.getTime() / 1000;
        const iat = decoded.iat || 0;
        if (changePasswordDate > iat)
            throw new Error("Password Changed");
    }
    return user;
});
