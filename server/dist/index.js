"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const dbConnection_1 = __importDefault(require("./db/dbConnection"));
const router_1 = __importDefault(require("./app/router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 5000;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
(0, dbConnection_1.default)(app, port);
// CORS configuration
// const whitelist = [/* 'https://noporata.onrender.com', */ 'http://localhost:5157',"http://localhost:4173"];
// const corsOptions = {
//   origin: function (origin: string, callback: Function) {
//     // Check if the requested origin is in the whitelist or is undefined (same origin).
//     if (whitelist.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };
// Middlewares
app.use(express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use(limiter);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});
(0, router_1.default)(app);
