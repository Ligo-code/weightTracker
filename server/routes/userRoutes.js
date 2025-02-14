import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { validateUserRegistration } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/register", validateUserRegistration, registerUser); // if the credentials are not valid, the middleware will handle the 400 error


export default router;
