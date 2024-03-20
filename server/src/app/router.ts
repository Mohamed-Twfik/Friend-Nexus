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


    app.get("/file/:filename", authentication, (req, res) => {
        return res.sendFile(path.join(__dirname, "..", "..", "uploads", req.params.filename));
    });
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