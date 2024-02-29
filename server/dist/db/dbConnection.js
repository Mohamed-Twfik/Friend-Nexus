"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConnection = (app, port) => {
    if (!process.env.DB_URL) {
        console.log("Please provide a valid DB_URL");
        return;
    }
    mongoose_1.default
        .connect(process.env.DB_URL)
        .then(() => {
        console.log("Connected successfully to Database server");
        const listenOn = process.env.PORT || port;
        app.listen(listenOn, () => console.log(`app listening on URL: http://localhost:${listenOn}`));
    })
        .catch((err) => console.log(err));
};
exports.default = dbConnection;
