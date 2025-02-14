import express from "express";
import {
  addWeightEntry,
  getWeightEntries,
  updateWeightEntry,
  deleteWeightEntry,
} from "../controllers/weightController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD для записей веса
router.post("/", protect, addWeightEntry); // Добавить запись
router.get("/", protect, getWeightEntries); // Получить все записи пользователя
router.put("/:id", protect, updateWeightEntry); // Обновить запись
router.delete("/:id", protect, deleteWeightEntry); // Удалить запись

export default router;
