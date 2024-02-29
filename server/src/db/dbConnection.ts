import mongoose from "mongoose";
import dotenv from "dotenv";
import { Application } from "express";
dotenv.config();

const dbConnection = (app: Application, port: number) => {
  if (!process.env.DB_URL) {
    console.log("Please provide a valid DB_URL");
    return;
  }
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected successfully to Database server");
      const listenOn = process.env.PORT || port;
      app.listen(listenOn, () =>
        console.log(`app listening on URL: http://localhost:${listenOn}`)
      );
    })
    .catch((err) => console.log(err));
};

export default dbConnection;