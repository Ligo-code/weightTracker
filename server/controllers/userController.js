import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Функция для генерации токена
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" }); // Токен теперь живёт 15 минут
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: "30d" }); // Refresh Token - 30 дней
};
// Регистрация пользователя
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Пришли данные:", req.body); // Лог перед обработкой

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    console.log("Пользователь создан:", user); // Лог после создания

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Вход пользователя
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      accessToken: generateAccessToken(user._id),
      refreshToken: generateRefreshToken(user._id), //  Отдаём Refresh Token
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Обновление токена (новый эндпоинт)
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.id);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
