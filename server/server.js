import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import mongoose from "mongoose";
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
  max: 1000,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use(xss());

app.use(mongoSanitize());

const allowedOrigins = [
  "https://weighttracker-1.onrender.com", // Фронтенд
  "https://weighttracker-heqj.onrender.com", // Бэкенд
  "http://localhost:5173", // Локальная разработка
  "http://localhost:5000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || "*");
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

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "API OK",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("Server is running..."));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
