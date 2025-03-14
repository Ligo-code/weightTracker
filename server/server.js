import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import connectDB from "./db/connect.js";
import userRoutes from "./routes/userRoutes.js";
import weightRoutes from "./routes/weightRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

import "dotenv/config"; 
connectDB();

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use(xss());

app.use(mongoSanitize());

const allowedOrigins = [
  "https://weighttracker-1.onrender.com", // Фронтенд
  "https://weighttracker-heqj.onrender.com", // Бэкенд
  "http://localhost:5173", // Локальная разработка
  "http://localhost:5000"
];

// Настройка CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || "*");
      /*callback(null, true);*/
    } else {
      console.log(`Blocked CORS request from: ${origin}`);
      callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.options("*", cors(corsOptions)); 
app.use(cors(corsOptions));

/*// Ручная настройка заголовков CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.origin) ? req.headers.origin : "");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});*/

// Ручная настройка CORS (подстраховка)
app.use((req, res, next) => {
  if (allowedOrigins.includes(req.headers.origin)) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/weight", weightRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("Server is running..."));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));