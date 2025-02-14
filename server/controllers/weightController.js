import WeightEntry from "../models/WeightEntry.js";

// Add a new weight entry
export const addWeightEntry = async (req, res) => {
  try {
    const { weight, date, note } = req.body;

    const weightEntry = new WeightEntry({
      userId: req.user.id, // get the user ID from the request
      weight,
      date,
      note,
    });

    const savedEntry = await weightEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ message: "Error adding weight entry", error });
  }
};

// Get all weight entries
export const getWeightEntries = async (req, res) => {
  try {
    const { sortBy, order, minWeight, maxWeight, page, limit } = req.query;
    const query = { userId: req.user.id };

    if (minWeight) query.weight = { ...query.weight, $gte: minWeight };
    if (maxWeight) query.weight = { ...query.weight, $lte: maxWeight };

    const sortOptions = {};
    if (sortBy) sortOptions[sortBy] = order === "desc" ? 1 : -1;

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const entries = await WeightEntry.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error getting weight entries", error });
  }
};

// Update a weight entry
export const updateWeightEntry = async (req, res) => {
  try {
    const entry = await WeightEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    entry.weight = req.body.weight || entry.weight;
    entry.date = req.body.date || entry.date;
    entry.note = req.body.note || entry.note;

    const updatedEntry = await entry.save();
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: "Error updating weight entry", error });
  }
};

// Delete a weight entry
export const deleteWeightEntry = async (req, res) => {
  try {
    const entry = await WeightEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await entry.deleteOne();
    res.json({ message: "Entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting weight entry", error });
  }
};
