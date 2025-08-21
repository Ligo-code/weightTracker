const API_URL = "https://weighttracker-1.onrender.com/api/users";


export const registerUser = async (userData) => {
  try {
    console.log("Отправка запроса на регистрацию:", userData);

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("JSON-ответ (регистрация):", data);

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    console.error("[Register Error]:", error.message);
    throw error;
  }
};


export const loginUser = async (formData) => {
  try {
    console.log("Отправка запроса на вход:", formData);

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await response.json();
    console.log("JSON-ответ (вход):", data);

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  } catch (error) {
    console.error("[Login Error]:", error.message);
    throw error;
  }
};


export const refreshToken = async () => {
  try {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (!storedRefreshToken) throw new Error("No refresh token available");

    console.log("Refreshing access token...");

    const response = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedRefreshToken}`,
      },
    });

    const data = await response.json();
    console.log("Token refreshed:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("[Refresh Token Error]:", error.message);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};


export const logoutUser = () => {
  console.log("Выход из аккаунта...");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  console.log("[Logout]: User logged out");
};
