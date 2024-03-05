import express, { Application, Request, NextFunction, Response } from "express";
import path from "path";
import cron from "node-cron";

import { ErrorResponse } from "./types/response";
import errorMessage from "./utils/errorMessage";
// import swagger from '../swagger';
import authRouter from "./routes/auth.router"
import userRouter from "./routes/user.router"
import friendRouter from "./routes/friend.router"
import chatRouter from "./routes/chat.router"
import messageRouter from "./routes/message.router"
import authentication from "./middlewares/Auth/authentication";
import tokenModel from "./models/token.model";

export default (app: Application)=>{

    // Schedule a task to run every hour
    cron.schedule('0 * * * *', async () => {
    try {
        // Find and delete tokens that have expired
        await tokenModel.deleteMany({ expireAt: { $lt: new Date() } });
    } catch (error) {
        console.error('Error deleting expired tokens:', error);
    }
    });

    app.use("/auth", authRouter);
    app.use("/file", authentication, express.static(path.join(__dirname, "uploads")))
    app.use("/users", authentication, userRouter);
    app.use("/friends", authentication, friendRouter);
    app.use("/chats", authentication, chatRouter);
    app.use("/messages", authentication, messageRouter);

    // swagger(app);

    // Not Found Page
    app.use((req, res, next) => {
        next(errorMessage(404, `Not found - ${req.originalUrl}`));
    });

    // to catch any error
    app.use((error: ErrorResponse, req: Request, res: Response, next: NextFunction): void => {
        res.status(error.status || 500).json(error);
    });
}