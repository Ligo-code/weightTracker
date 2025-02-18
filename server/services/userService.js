import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Функция генерации токенов
const generateAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: "30d" });

export const registerUserService = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const user = await User.create({ name, email, password });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    accessToken: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  };
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    accessToken: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  };
};

export const refreshTokenService = (refreshToken) => {
  if (!refreshToken) throw new Error("Unauthorized");

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    return generateAccessToken(decoded.id);
  } catch {
    throw new Error("Invalid refresh token");
  }
};

export const logoutUserService = async (refreshToken) => {
  if (!refreshToken) throw new Error("Unauthorized");
  return { message: "User logged out successfully" };
};

export const resetPasswordService = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  user.password = newPassword;
  await user.save();
  return { message: "Password updated successfully" };
};

