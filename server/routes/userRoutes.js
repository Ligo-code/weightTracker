import express from "express";
import { registerUser, loginUser, refreshToken } from "../controllers/userController.js";
import rateLimit from "express-rate-limit";
import { logoutUser } from "../controllers/userController.js";
import { resetPassword } from "../controllers/userController.js";

const router = express.Router();

// Ограничение на 10 попыток входа за 10 минут
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please try again later.",
  });
  

// Маршруты
router.post("/register", registerUser); // Регистрация без изменений
router.post("/login", loginLimiter, loginUser); // Теперь ограничение на 5 попыток
router.post("/refresh-token", refreshToken); // Новый эндпоинт для обновления токена
router.post("/logout", logoutUser);
router.post("/reset-password", resetPassword);

export default router;
