import express from "express";
import {
  userRegister,
  userLogin,
  checkToken,
} from "../controllers/user.controllers.js"; // Adjust the import path

const router = express.Router();

// User Registration
router.post("/register", userRegister);

// User Login
router.post("/login", userLogin);

// Check Token
router.get("/check", checkToken);

export default router;
