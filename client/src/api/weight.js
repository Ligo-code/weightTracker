const API_URL = "http://localhost:5000/api/weight";
const getToken = () => localStorage.getItem("accessToken");

// Получить все записи веса
export const getWeightEntries = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch weight entries");

    const data = await response.json();
    console.log("[Fetched Entries]:", data);
    return data;
  } catch (error) {
    console.error("[Get Weight Entries Error]:", error.message);
    throw error;
  }
};

// Добавить новую запись веса
export const addWeightEntry = async (weight, note) => {
  try {
    const date = new Date().toISOString();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ weight, note, date }),
    });

    if (!response.ok) throw new Error("Failed to add weight entry");

    return await response.json();
  } catch (error) {
    console.error("[Add Weight Entry Error]:", error.message);
    throw error;
  }
};

// Обновить запись веса
export const updateWeightEntry = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update weight entry");
    }

    return await response.json();
  } catch (error) {
    console.error("[Update Weight Entry Error]:", error.message);
    throw error;
  }
};

// Удалить запись веса
export const deleteWeightEntry = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) throw new Error("Failed to delete weight entry");

    return await response.json();
  } catch (error) {
    console.error("[Delete Weight Entry Error]:", error.message);
    throw error;
  }
};