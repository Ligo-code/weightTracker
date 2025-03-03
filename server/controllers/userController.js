import {
  registerUserService,
  loginUserService,
  refreshTokenService,
  logoutUserService,
  resetPasswordService,
} from "../services/userService.js";
import User from "../models/User.js";

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

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User data being returned:", {
      name: user.name,
      email: user.email,
      goal: user.goal,
      initialWeight: user.initialWeight,
      targetWeight: user.targetWeight,
      currentWeight: user.currentWeight,
    });
    res.json({
      name: user.name,
      email: user.email,
      goal: user.goal,
      initialWeight: user.initialWeight,
      targetWeight: user.targetWeight,
      currentWeight: user.currentWeight,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const userData = await loginUserService(req.body);
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error during login:", error.message);   
    console.log("Sending error response:", { message: error.message });
    res.status(400).json({ message: error.message });
  }
};

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
    const response = await resetPasswordService(
      req.body.email,
      req.body.newPassword
    );
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
