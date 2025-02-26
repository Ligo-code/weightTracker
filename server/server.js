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

// Инициализация .env
dotenv.config();

// Подключаем базу данных
connectDB();

// Создаем Express-приложение
const app = express();

// Защита заголовков
app.use(helmet());

// Ограничение запросов (100 запросов за 15 минут)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Защита от XSS-атак
app.use(xss());

// Защита от NoSQL-инъекций
app.use(mongoSanitize());

// Разрешаем CORS для запросов с фронта
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Разрешаем передачу cookies и токенов
};
app.use(cors(corsOptions));

app.use(express.json());

// Подключаем маршруты
app.use("/api/users", userRoutes);
app.use("/api/weight", weightRoutes);

// Глобальная обработка ошибок
app.use(errorHandler);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("Server is running..."));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
