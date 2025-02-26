import User from "../models/User.js";
import {
  addWeightEntryService,
  getWeightEntriesService,
  updateWeightEntryService,
  deleteWeightEntryService,
  getLatestWeightEntry
} from "../services/weightService.js";



export const addWeightEntry = async (req, res) => {
  try {
    console.log("Полученные данные:", req.body);
    console.log("Пользователь:", req.user.id);
    const { weight, note, date } = req.body;

    if (!weight || isNaN(weight) || weight < 0) {
      return res.status(400).json({ message: "Weight must be a number greater than 0" });
    }

    const user = await User.findById(req.user.id);
    if (!user) throw new Error("User not found");

    // ✅ Создаём новую запись веса
    const newEntry = await addWeightEntryService(req.user.id, { weight, note, date });

    // ✅ Теперь `currentWeight` обновляется на **самую последнюю** запись
    user.currentWeight = newEntry.weight;
    await user.save();

    console.log("Новая запись сохранена:", newEntry);
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("[Ошибка addWeightEntry]:", error);
    res.status(400).json({ message: error.message });
  }
};


export const getWeightEntries = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Проверяем, что `page` и `limit` - валидные числа
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const entriesData = await getWeightEntriesService(req.user.id, req.query);
    res.json({
      entries: entriesData.entries,
      totalPages: entriesData.totalPages, // ✅ Убедиться, что `totalPages` передаётся клиенту
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWeightEntry = async (req, res) => {
  try {
    const { weight, note, date } = req.body;

    if (!weight || isNaN(weight) || weight <= 0) {
      return res.status(400).json({ message: "Weight must be a number greater than 0" });
    }

    const user = await User.findById(req.user.id);
    if (!user) throw new Error("User not found");

    // ✅ Получаем отредактированную запись и самую последнюю запись
    const result = await updateWeightEntryService(req.user.id, req.params.id, { weight, note, date });

    if (!result || !result.updatedEntry) {
      return res.status(500).json({ message: "Failed to update entry" });
    }

    const { updatedEntry, latestEntry } = result;

    // ✅ Проверяем, является ли обновлённая запись самой последней
    if (latestEntry && updatedEntry._id.toString() === latestEntry._id.toString()) {
      user.currentWeight = latestEntry.weight;
      await user.save();
    }

    res.json(updatedEntry);
  } catch (error) {
    console.error("[Update Weight Entry Error]:", error);
    res.status(400).json({ message: error.message });
  }
};



export const deleteWeightEntry = async (req, res) => {
  try {
    const response = await deleteWeightEntryService(req.user.id, req.params.id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
