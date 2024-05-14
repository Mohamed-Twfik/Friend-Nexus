import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";
import dbConnection from "./dbConnection";
import router from "./app/router";
import morgan from "morgan";
import compression from "compression";
import fs from "fs";

dotenv.config();
const app = express();

dbConnection(app).then(() => {
  // CORS configuration
  const whitelist = ['http://localhost:5157',"http://localhost:4173"];
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Check if the requested origin is in the whitelist or is undefined (same origin).
      if (whitelist.includes(origin as string) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };

  // Middlewares
  app.use(express.static(path.join(__dirname, "uploads")));
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);
  app.use(cors(corsOptions));
  app.use(helmet());

  const accessLogStream = fs.createWriteStream(path.join(__dirname, "..", "access.log"), { flags: "a" });
  app.use(morgan("combined", { stream: accessLogStream }));
  app.use(compression());
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });
  router(app);
}).catch(err => {
  console.error("Database Connection Error: " + err);
});



