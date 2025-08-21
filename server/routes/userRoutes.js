import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  getUserProfile,
  logoutUser,
  resetPassword,
  updateUserCurrentWeight, 
} from "../controllers/userController.js";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/authMiddleware.js";
import { validateUserRegistration } from "../middleware/validationMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many login attempts. Please try again later.",
});

router.post("/register", validateUserRegistration, registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);
router.post("/reset-password", resetPassword);

router.put("/updateWeight", protect, updateUserCurrentWeight);

export default router;
