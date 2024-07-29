import express from "express";
import {
  adminRegister,
  adminLogin,
  checkToken,
} from "../controllers/admin.controllers.js";

const router = express.Router();

// Admin Registration
router.post("/register", adminRegister);

// Admin Login
router.post("/login", adminLogin);

// Token Verification
router.get("/check", checkToken);

export default router;
