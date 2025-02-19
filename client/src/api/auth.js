const API_URL = "http://localhost:5000/api/users";

// Функция для регистрации
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("[Register Error]:", error.message);
    throw error;
  }
};

// Функция для входа
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);  // Исправлено имя ключа
    localStorage.setItem("refreshToken", data.refreshToken); // Сохраняем refresh токен
    return data;
  } catch (error) {
    console.error("[Login Error]:", error.message);
    throw error;
  }
};

// Функция для обновления токена
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${refreshToken}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  } catch (error) {
    console.error("[Refresh Token Error]:", error.message);
    throw error;
  }
};

// Функция выхода из аккаунта
export const logoutUser = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      console.log("[Logout]: User logged out");
    }
  };