import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendOtpEmail from "../utils/sendEmail.js";

// Create a signed JWT token for a user with their ID and role.
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });


// Pick only the safe fields we want to send to the client
const formatUser = (u) => ({
  id: u._id,
  fullName: u.fullName,
  email: u.email,
  role: u.role,
  leaveBalance: u.leaveBalance,
  dateOfJoining: u.dateOfJoining,
});



// POST /api/auth/register/send-otp – Validate fields & send registration OTP
export const sendRegisterOtp = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Full name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = await Otp.generate(normalizedEmail, "registration");

    try {
      await sendOtpEmail(normalizedEmail, otp, "registration");
    } catch (error) {
      await Otp.deleteMany({ email: normalizedEmail, purpose: "registration" });
      error.statusCode = 502;
      error.message = "Unable to send verification OTP email right now";
      throw error;
    }

    res.json({ success: true, message: "Verification OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};


// POST /api/auth/register/verify – Verify OTP & create account
export const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { fullName, email, password, otp } = req.body;

    if (!fullName || !email || !password || !otp) {
      return res.status(400).json({ success: false, message: "All fields and OTP are required" });
    }

    const valid = await Otp.verify(email, otp, "registration");
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    const user = await User.create({ fullName, email, password, role: "employee" });

    res.status(201).json({ success: true, data: { token: generateToken(user), user: formatUser(user) } });
  } catch (err) {
    next(err);
  }
};


// POST /api/auth/login – Authenticate & return token
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.json({ success: true, data: { token: generateToken(user), user: formatUser(user) } });
  } catch (err) {
    next(err);
  }
};




// POST /api/auth/forgot-password – Send OTP for password reset
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account with that email" });
    }

    const otp = await Otp.generate(normalizedEmail, "reset");

    try {
      await sendOtpEmail(normalizedEmail, otp, "reset");
    } catch (error) {
      await Otp.deleteMany({ email: normalizedEmail, purpose: "reset" });
      error.statusCode = 502;
      error.message = "Unable to send password reset OTP email right now";
      throw error;
    }

    res.json({ success: true, message: "Password reset OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};


// POST /api/auth/reset-password – Verify OTP & set new password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const valid = await Otp.verify(email, otp, "reset");
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};




// GET /api/auth/profile – Return the logged-in user's info
export const getProfile = (req, res) => {
  res.json({ success: true, data: formatUser(req.user) });
};
