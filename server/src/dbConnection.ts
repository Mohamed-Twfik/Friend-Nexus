import mongoose from "mongoose";
import dotenv from "dotenv";
import socketIO from "./socket";
import { Application } from "express";
import { createServer } from "http";

dotenv.config();

/**
 * Start Database and socket connection then start the server
 * @param app the express application
 * @returns void
 */
const dbConnection = async (app: Application) => {
  const port = 5000;
  if (!process.env.DB_URI) {
    console.log("Please provide a valid DB_URI");
    return;
  }
  try {
    const connect = await mongoose.connect(process.env.DB_URI);
    if (!connect) throw new Error("Database connection Error");
    console.log("Connected successfully to Database server");
    const listenOn = process.env.PORT || port;
    const httpServer = createServer(app);
    socketIO.init(httpServer);
    httpServer.listen(listenOn, () => {
      console.log(`app listening on URL: http://localhost:${listenOn}`)
    });
  } catch (err) {
    throw err;
  }
};

export default dbConnection;