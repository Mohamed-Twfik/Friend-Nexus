import express, { Application, Request, NextFunction, Response } from "express";
import path from "path";
import { ErrorMessage } from "./types/response";
import errorMessage from "./utils/errorMessage";
import swagger from '../swagger';
import authRouter from "./routes/auth.router"
import userRouter from "./routes/user.router"
import friendRouter from "./routes/friend.router"
import chatRouter from "./routes/chat.router"
import messageRouter from "./routes/message.router"
import authentication from "./middlewares/Auth/authentication";

export default (app: Application)=>{
    app.use("/auth", authRouter);
    app.use(authentication)
    app.use("/file", express.static(path.join(__dirname, "uploads")))
    app.use("/users", userRouter);
    app.use("/friends", friendRouter);
    app.use("/chats", chatRouter);
    app.use("/messages", messageRouter);
    // swagger(app);

    // Not Found Page
    app.use((req, res, next) => {
        next(errorMessage(404, `Not found - ${req.originalUrl}`));
    });

    // to catch any error
    app.use((error: ErrorMessage, req: Request, res: Response, next: NextFunction) => {
        const {message, status} = error;
        res.status(status || 500).json({message, status});
    });
}