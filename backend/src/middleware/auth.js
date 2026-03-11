import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Authentication middleware
 * Extracts JWT from "Authorization: Bearer <token>" header,
 * verifies it, and attaches the user object to req.user.
 */
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Verify token and find user
    const { id } = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default auth;
