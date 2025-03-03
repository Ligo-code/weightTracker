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
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use(xss());

app.use(mongoSanitize());

const corsOptions = {
  origin: ["https://weighttracker-heqj.onrender.com", "http://localhost:5173"],
  credentials: true, 
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Добавляем OPTIONS
};

app.options("*", cors(corsOptions)); // Разрешаем preflight-запросы
app.use(cors(corsOptions)); // Основные CORS-настройки

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/weight", weightRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("Server is running..."));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));