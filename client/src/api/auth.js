const API_URL = "https://weighttracker-1.onrender.com/api/users";


export const registerUser = async (userData) => {
  try {
    console.log("Отправка запроса на регистрацию:", userData);

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    // Проверяем есть ли контент для парсинга
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    let data;
    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    } else {
      // Пустой ответ
      data = { message: "Registration successful" };
    }

    console.log("Parsed data:", data);

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

    console.log("Login response status:", response.status);

    const responseText = await response.text();
    console.log("Login raw response:", responseText);

    let data;
    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Login JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    } else {
      data = { message: "Login successful" };
    }

    console.log("Login parsed data:", data);

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
