import { Router } from "express";
import {
  login,
  sendRegisterOtp,
  verifyRegisterOtp,
  forgotPassword,
  resetPassword,
  getProfile,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = Router();

// Auth
router.post("/register/send-otp", sendRegisterOtp);
router.post("/register/verify", verifyRegisterOtp);
router.post("/login", login);

// Password reset (OTP)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);

// Protected
router.get("/profile", auth, getProfile);

export default router;
