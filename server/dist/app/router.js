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
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const errorMessage_1 = __importDefault(require("./utils/errorMessage"));
// import swagger from '../swagger';
const authentication_1 = __importDefault(require("./middlewares/auth/authentication"));
const status_model_1 = __importDefault(require("./models/status.model"));
const token_model_1 = __importDefault(require("./models/token.model"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const chat_router_1 = __importDefault(require("./routes/chat.router"));
const friendShip_router_1 = __importDefault(require("./routes/friendShip.router"));
const message_router_1 = __importDefault(require("./routes/message.router"));
const status_router_1 = __importDefault(require("./routes/status.router"));
const token_router_1 = __importDefault(require("./routes/token.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const fs_1 = __importDefault(require("fs"));
const catchErrors_1 = __importDefault(require("./utils/catchErrors"));
exports.default = (app) => {
    // Schedule a task to run every hour
    node_cron_1.default.schedule('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find and delete tokens that have expired
            yield token_model_1.default.deleteMany({ expireAt: { $lt: new Date() } });
        }
        catch (error) {
            console.error('Error deleting expired tokens: ', error);
        }
    }));
    // Schedule a task to run every day
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find and delete statuses that have expired
            yield status_model_1.default.deleteMany({ expireAt: { $lt: new Date() } });
        }
        catch (error) {
            console.error('Error deleting expired statuses: ', error);
        }
    }));
    app.get("/file/:disposition/:filename", authentication_1.default, (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = path_1.default.join("uploads", req.params.filename);
        const disposition = req.params.disposition === "attachment" ? "attachment" : "inline";
        const file = fs_1.default.createReadStream(filePath);
        file.on("error", () => {
            return next((0, errorMessage_1.default)(404, "File not found"));
        });
        const contentType = getContentType(filePath);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", disposition);
        file.pipe(res);
    })));
    app.use("/auth", auth_router_1.default);
    app.use("/users", authentication_1.default, user_router_1.default);
    app.use("/friendShips", authentication_1.default, friendShip_router_1.default);
    app.use("/tokens", authentication_1.default, token_router_1.default);
    app.use("/statuses", authentication_1.default, status_router_1.default);
    app.use("/chats", authentication_1.default, chat_router_1.default);
    app.use("/messages", authentication_1.default, message_router_1.default);
    // swagger(app);
    // Not Found Page
    app.use((req, res, next) => {
        next((0, errorMessage_1.default)(404, `Not Found URL: ${req.originalUrl} With Method: ${req.method}`));
    });
    // to catch any error
    app.use((error, req, res, next) => {
        res.status(error.status || 500).json(error);
    });
};
// Function to determine the content type based on file extension
function getContentType(filePath) {
    const ext = path_1.default.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.bmp':
            return 'image/bmp';
        case '.svg':
            return 'image/svg+xml';
        case '.webp':
            return 'image/webp';
        case '.ico':
            return 'image/x-icon';
        case '.doc':
            return 'application/msword';
        case '.docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case '.xls':
            return 'application/vnd.ms-excel';
        case '.xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case '.ppt':
            return 'application/vnd.ms-powerpoint';
        case '.pptx':
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case '.txt':
            return 'text/plain';
        case '.csv':
            return 'text/csv';
        case '.mp3':
            return 'audio/mpeg';
        case '.wav':
            return 'audio/wav';
        case '.ogg':
            return 'audio/ogg';
        case '.flac':
            return 'audio/flac';
        case '.mp4':
            return 'video/mp4';
        case '.avi':
            return 'video/x-msvideo';
        case '.mov':
            return 'video/quicktime';
        case '.mkv':
            return 'video/x-matroska';
        case '.webm':
            return 'video/webm';
        case '.zip':
            return 'application/zip';
        case '.rar':
            return 'application/vnd.rar';
        case '.tar':
            return 'application/x-tar';
        case '.7z':
            return 'application/x-7z-compressed';
        case '.ttf':
            return 'font/ttf';
        case '.otf':
            return 'font/otf';
        case '.woff':
            return 'font/woff';
        case '.woff2':
            return 'font/woff2';
        case '.pdf':
            return 'application/pdf';
        case '.epub':
            return 'application/epub+zip';
        case '.json':
            return 'application/json';
        case '.xml':
            return 'application/xml';
        case '.yaml':
        case '.yml':
            return 'application/x-yaml';
        default:
            return 'application/octet-stream'; // Default to binary data if type is unknown
    }
}
