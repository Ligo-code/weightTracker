import WeightEntry from "../models/WeightEntry.js";

// Добавить новую запись веса
export const addWeightEntry = async (req, res) => {
  try {
    const { weight, date, note } = req.body;

    const weightEntry = new WeightEntry({
      userId: req.user.id, // Получаем ID пользователя из токена
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

// Получить все записи пользователя
export const getWeightEntries = async (req, res) => {
  try {
    const entries = await WeightEntry.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weight entries", error });
  }
};

// Обновить запись веса
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

// Удалить запись веса
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
