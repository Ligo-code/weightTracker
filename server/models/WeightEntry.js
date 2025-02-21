import mongoose from "mongoose";

const weightEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const WeightEntry = mongoose.model("WeightEntry", weightEntrySchema);

export default WeightEntry;
