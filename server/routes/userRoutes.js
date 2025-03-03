import express from "express";
import { registerUser, loginUser, refreshToken, getUserProfile } from "../controllers/userController.js";
import rateLimit from "express-rate-limit";
import { logoutUser } from "../controllers/userController.js";
import { resetPassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ограничение на 10 попыток входа за 10 минут
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please try again later.",
  });
  

// Маршруты
router.post("/register", registerUser); 
router.post("/login", loginLimiter, loginUser); 
router.get("/profile", protect, getUserProfile);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);
router.post("/reset-password", resetPassword);

export default router;
