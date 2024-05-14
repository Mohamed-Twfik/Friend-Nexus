import mongoose from "mongoose";
import dotenv from "dotenv";
import socketIO from "./socket";
import { Application } from "express";
import { createServer } from "http";
// import { createServer } from "https";
// import fs from "fs";
// import path from "path";

dotenv.config();

/**
 * Start Database and socket connection then start the server
 * @param { Application } app the express application
 * @returns { Promise<void> } return promise of void
 */
const dbConnection = async (app: Application): Promise<void> => {
  const port = 5000;

  // For SSL/TLS  command: openssl req -nodes -new -x509 -keyout server.key -out server.cert
  // const privateKey = fs.readFileSync(path.join(__dirname, "..", "server.key"));
  // const certificate = fs.readFileSync(path.join(__dirname, "..", "server.cert"));

  if (!process.env.DB_URI) {
    console.log("Please provide a valid DB_URI");
    return;
  }
  try {
    const connect = await mongoose.connect(process.env.DB_URI);
    if (!connect) throw new Error("Database connection Error");
    console.log("Connected successfully to Database server");
    const listenOn = process.env.PORT || port;
    // const httpServer = createServer({key: privateKey, cert: certificate}, app);
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