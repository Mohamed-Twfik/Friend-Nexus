import { Application, NextFunction, Request, Response } from "express";
import cron from "node-cron";
import path from "path";

import { ErrorResponse } from "./types/response";
import errorMessage from "./utils/errorMessage";
// import swagger from '../swagger';
import authentication from "./middlewares/auth/authentication";
import statusModel from "./models/status.model";
import tokenModel from "./models/token.model";

import authRouter from "./routes/auth.router";
import chatRouter from "./routes/chat.router";
import friendRouter from "./routes/friendShip.router";
import messageRouter from "./routes/message.router";
import statusRouter from "./routes/status.router";
import tokenRouter from "./routes/token.router";
import userRouter from "./routes/user.router";
import fs from "fs";
import catchErrors from "./utils/catchErrors";

export default (app: Application)=>{

    // Schedule a task to run every hour
    cron.schedule('0 * * * *', async () => {
        try {
            // Find and delete tokens that have expired
            await tokenModel.deleteMany({ expireAt: { $lt: new Date() } });
        } catch (error) {
            console.error('Error deleting expired tokens: ', error);
        }
    });

    
    // Schedule a task to run every day
    cron.schedule('0 0 * * *', async () => {
        try {
            // Find and delete statuses that have expired
            await statusModel.deleteMany({ expireAt: { $lt: new Date() } });
        } catch (error) {
            console.error('Error deleting expired statuses: ', error);
        }
    });


    app.get("/file/:disposition/:filename", authentication , catchErrors(async (req, res, next) => {
        const filePath = path.join("uploads", req.params.filename);
        const disposition = req.params.disposition === "attachment" ? "attachment" : "inline";
        const file = fs.createReadStream(filePath);
        file.on("error", () => {
            return next(errorMessage(404, "File not found"));
        });
        const contentType = getContentType(filePath);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", disposition);
        file.pipe(res);
    }));
    
    app.use("/auth", authRouter);
    app.use("/users", authentication, userRouter);
    app.use("/friendShips", authentication, friendRouter);
    app.use("/tokens", authentication, tokenRouter);
    app.use("/statuses", authentication, statusRouter);
    app.use("/chats", authentication, chatRouter);
    app.use("/messages", authentication, messageRouter);

    // swagger(app);

    // Not Found Page
    app.use((req, res, next) => {
        next(errorMessage(404, `Not Found URL: ${req.originalUrl} With Method: ${req.method}`));
    });

    // to catch any error
    app.use((error: ErrorResponse, req: Request, res: Response, next: NextFunction): void => {
        res.status(error.status || 500).json(error);
    });
}


// Function to determine the content type based on file extension
function getContentType(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
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
