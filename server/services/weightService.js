import WeightEntry from "../models/WeightEntry.js";

export const addWeightEntryService = async (userId, { weight, date, note }) => {
  console.log("Добавляем запись:", userId, weight, date, note);
  if (!weight || isNaN(weight) || weight <= 0) {
    throw new Error("Weight must be a number greater than 0");
  }

  const weightEntry = new WeightEntry({ userId, weight, date, note });
  return await weightEntry.save();
};

export const getWeightEntriesService = async (userId, { sortBy="date", order="desc", minWeight, maxWeight, page=1, limit=5 }) => {
  const query = { userId };

  if (minWeight) query.weight = { ...query.weight, $gte: minWeight };
  if (maxWeight) query.weight = { ...query.weight, $lte: maxWeight };

  const sortOptions = {};
  if (sortBy) sortOptions[sortBy] = order === "desc" ? -1 : 1;

  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 5;
  const skip = (pageNumber - 1) * pageSize;
 
  const totalEntries = await WeightEntry.countDocuments(query);
  const totalPages = Math.ceil(totalEntries / pageSize);

  const entries = await WeightEntry.find(query).sort(sortOptions).skip(skip).limit(pageSize);

  return { entries, totalPages };
};

export const updateWeightEntryService = async (userId, entryId, { weight, date, note }) => {
  const entry = await WeightEntry.findById(entryId);
  if (!entry) throw new Error("Entry not found");
  if (entry.userId.toString() !== userId) throw new Error("Not authorized");

  if (weight !== undefined) {
    if (!weight || isNaN(weight) || weight <= 0) {
      throw new Error("Weight must be a number greater than 0");
    }
    entry.weight = weight;
  }

  entry.date = date || entry.date;
  entry.note = note || entry.note;

  return await entry.save();
};

export const deleteWeightEntryService = async (userId, entryId) => {
  const entry = await WeightEntry.findById(entryId);
  if (!entry) throw new Error("Entry not found");
  if (entry.userId.toString() !== userId) throw new Error("Not authorized");

  await entry.deleteOne();
  return { message: "Entry deleted" };
};
