import WeightEntry from "../models/WeightEntry.js";


export const addWeightEntryService = async (userId, { weight, date, note }) => {
  console.log("Добавляем запись:", userId, weight, date, note);
  if (!weight || isNaN(weight) || weight <= 0) {
    throw new Error("Weight must be a number greater than 0");
  }

  const weightEntry = new WeightEntry({ userId, weight, date, note });
  return await weightEntry.save();
};

export const getWeightEntriesService = async (userId, { sortBy="createdAt", order="desc", page=1, limit=5, latest = false }) => {
  const query = { userId };
  const sortOptions = { [sortBy]: order === "desc" ? -1 : 1 };

  if (latest) {
    // Теперь currentWeight определяется по последней записи по времени добавления
    const latestEntry = await WeightEntry.findOne(query).sort({ createdAt: -1 });
    return latestEntry ? latestEntry.weight : null;
  }

  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 5;
  const skip = (pageNumber - 1) * pageSize;
  const totalEntries = await WeightEntry.countDocuments(query);
  const totalPages = Math.ceil(totalEntries / pageSize);

  const entries = await WeightEntry.find(query).sort(sortOptions).skip(skip).limit(pageSize);
  
  return { entries, totalPages };
};


export const updateWeightEntryService = async (userId, entryId, { weight, date, note }) => {
  console.log("Updating entry with ID:", entryId); // Проверка ID
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

  // ✅ Добавляем поле updatedAt для предотвращения сортировки по дате обновления
  entry.updatedAt = new Date();

  return await entry.save();
};

export const deleteWeightEntryService = async (userId, entryId) => {
  const entry = await WeightEntry.findById(entryId);
  if (!entry) throw new Error("Entry not found");
  if (entry.userId.toString() !== userId) throw new Error("Not authorized");

  await entry.deleteOne();
  return { message: "Entry deleted" };
};

// ✅ Добавляем функцию для получения самой последней записи по дате
export const getLatestWeightEntry = async (userId) => {
  return await WeightEntry.findOne({ userId }).sort({ createdAt: -1 }); // Сортируем по дате (самая последняя запись)
};
