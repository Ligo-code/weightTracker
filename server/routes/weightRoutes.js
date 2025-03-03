import express from "express";
import {
  addWeightEntry,
  getWeightEntries,
  updateWeightEntry,
  deleteWeightEntry,
} from "../controllers/weightController.js";
import { protect } from "../middleware/authMiddleware.js"; 
const router = express.Router();

router.post("/", protect, addWeightEntry);
router.get("/", protect, getWeightEntries);
router.put("/:id", protect, updateWeightEntry);
router.delete("/:id", protect, deleteWeightEntry);

export default router;
