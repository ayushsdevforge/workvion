import { Router } from "express";
import { markAttendance, getOwnAttendance, getAllAttendance } from "../controllers/attendanceController.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = Router();

// All attendance routes require authentication
router.use(auth);

// Employee routes
router.post("/",   role("employee"), markAttendance);    // Mark daily attendance
router.get("/my",  role("employee"), getOwnAttendance);  // View own records

// Admin routes
router.get("/all", role("admin"), getAllAttendance);      // View all records

export default router;
