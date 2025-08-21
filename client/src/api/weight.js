const API_URL = "https://weighttracker-heqj.onrender.com/api/weight";
const getToken = () => localStorage.getItem("accessToken");

export const getWeightEntries = async (
  page = 1,
  limit = 5,
  sortBy = "date",
  order = "desc"
) => {
  try {
    const response = await fetch(
      `${API_URL}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch weight entries");

    return await response.json();
  } catch (error) {
    console.error("[Get Weight Entries Error]:", error.message);
    throw error;
  }
};

export const addWeightEntry = async (weight, note, date) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ weight, note, date }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add weight entry");
    }

    return await response.json();
  } catch (error) {
    console.error("[Add Weight Entry Error]:", error.message);
    throw error;
  }
};

export const updateWeightEntry = async (id, data) => {
  try {
    console.log("Updating entry with ID:", id); 
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

    const updatedEntry = await response.json();
    return updatedEntry; 
  } catch (error) {
    console.error("[Update Weight Entry Error]:", error.message);
    throw error;
  }
};

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

export default {
  getWeightEntries,
  addWeightEntry,
  updateWeightEntry,
  deleteWeightEntry,
};
