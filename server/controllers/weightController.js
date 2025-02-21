import {
  addWeightEntryService,
  getWeightEntriesService,
  updateWeightEntryService,
  deleteWeightEntryService,
} from "../services/weightService.js";

export const addWeightEntry = async (req, res) => {
  try {
    const { weight, note, date } = req.body;
    
    // Проверяем, что вес корректный (должен быть числом больше 0)
    if (!weight || isNaN(weight) || weight < 0) {
      return res.status(400).json({ message: "Weight must be a number greater than 0" });
    }

    const newEntry = await addWeightEntryService(req.user.id, { weight, note, date });
    res.status(201).json(newEntry);
  } catch (error) {
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
    res.json(entriesData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWeightEntry = async (req, res) => {
  try {
    const { weight } = req.body;

    // Проверяем, что вес корректный
    if (!weight || isNaN(weight) || weight < 0) {
      return res.status(400).json({ message: "Weight must be a number greater than 0" });
    }

    const updatedEntry = await updateWeightEntryService(req.user.id, req.params.id, req.body);
    res.json(updatedEntry);
  } catch (error) {
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
