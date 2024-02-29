import express from "express";
import cors from "cors";
import helmet from "helmet";
import dbConnection from "./db/dbConnection";
import router from "./app/router"
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 5000;
dbConnection(app, port);

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
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
router(app);
