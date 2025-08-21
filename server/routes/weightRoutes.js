import express from "express";
import {
  addWeightEntry,
  getWeightEntries,
  updateWeightEntry,
  deleteWeightEntry,
} from "../controllers/weightController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateWeightEntry } from "../middleware/validationMiddleware.js";
const router = express.Router();

router.post("/", protect, validateWeightEntry, addWeightEntry);
router.get("/", protect, getWeightEntries);
router.put("/:id", protect, validateWeightEntry, updateWeightEntry);
router.delete("/:id", protect, deleteWeightEntry);

export default router;
