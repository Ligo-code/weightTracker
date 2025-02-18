import {
  addWeightEntryService,
  getWeightEntriesService,
  updateWeightEntryService,
  deleteWeightEntryService,
} from "../services/weightService.js";

export const addWeightEntry = async (req, res) => {
  try {
    const newEntry = await addWeightEntryService(req.user.id, req.body);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWeightEntries = async (req, res) => {
  try {
    const entries = await getWeightEntriesService(req.user.id, req.query);
    res.json(entries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWeightEntry = async (req, res) => {
  try {
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
