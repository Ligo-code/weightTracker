import { registerUserService, loginUserService, refreshTokenService, logoutUserService, resetPasswordService } from "../services/userService.js";
// Регистрация пользователя
export const registerUser = async (req, res) => {
  console.log("Пришли данные:", req.body);

  try {
    const userData = await registerUserService(req.body);
    res.status(201).json(userData);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(400).json({ message: error.message });
  }
};

// Вход пользователя
export const loginUser = async (req, res) => {
  try {
    const userData = await loginUserService(req.body);
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(400).json({ message: error.message });
  }
};


// Обновление токена (новый эндпоинт)
export const refreshToken = async (req, res) => {
  try {
    const newAccessToken = refreshTokenService(req.body.refreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const response = await logoutUserService(req.body.refreshToken);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const response = await resetPasswordService(req.body.email, req.body.newPassword);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
