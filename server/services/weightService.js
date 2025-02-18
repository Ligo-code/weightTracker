import WeightEntry from "../models/WeightEntry.js";

export const addWeightEntryService = async (userId, { weight, date, note }) => {
  const weightEntry = new WeightEntry({ userId, weight, date, note });
  return await weightEntry.save();
};

export const getWeightEntriesService = async (userId, { sortBy, order, minWeight, maxWeight, page, limit }) => {
  const query = { userId };

  if (minWeight) query.weight = { ...query.weight, $gte: minWeight };
  if (maxWeight) query.weight = { ...query.weight, $lte: maxWeight };

  const sortOptions = {};
  if (sortBy) sortOptions[sortBy] = order === "desc" ? 1 : -1;

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  return await WeightEntry.find(query).sort(sortOptions).skip(skip).limit(pageSize);
};

export const updateWeightEntryService = async (userId, entryId, { weight, date, note }) => {
  const entry = await WeightEntry.findById(entryId);
  if (!entry) throw new Error("Entry not found");
  if (entry.userId.toString() !== userId) throw new Error("Not authorized");

  entry.weight = weight || entry.weight;
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
