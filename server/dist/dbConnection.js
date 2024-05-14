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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = __importDefault(require("./socket"));
const http_1 = require("http");
// import { createServer } from "https";
// import fs from "fs";
// import path from "path";
dotenv_1.default.config();
/**
 * Start Database and socket connection then start the server
 * @param { Application } app the express application
 * @returns { Promise<void> } return promise of void
 */
const dbConnection = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const port = 5000;
    // For SSL/TLS  command: openssl req -nodes -new -x509 -keyout server.key -out server.cert
    // const privateKey = fs.readFileSync(path.join(__dirname, "..", "server.key"));
    // const certificate = fs.readFileSync(path.join(__dirname, "..", "server.cert"));
    if (!process.env.DB_URI) {
        console.log("Please provide a valid DB_URI");
        return;
    }
    try {
        const connect = yield mongoose_1.default.connect(process.env.DB_URI);
        if (!connect)
            throw new Error("Database connection Error");
        console.log("Connected successfully to Database server");
        const listenOn = process.env.PORT || port;
        // const httpServer = createServer({key: privateKey, cert: certificate}, app);
        const httpServer = (0, http_1.createServer)(app);
        socket_1.default.init(httpServer);
        httpServer.listen(listenOn, () => {
            console.log(`app listening on URL: http://localhost:${listenOn}`);
        });
    }
    catch (err) {
        throw err;
    }
});
exports.default = dbConnection;
