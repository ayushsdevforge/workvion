import { Router } from "express";
import {
  applyLeave, getOwnLeaves, editLeave, cancelLeave,
  getAllLeaves, approveLeave, rejectLeave,
} from "../controllers/leaveController.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = Router();

// All leave routes require authentication
router.use(auth);

// Employee routes
router.post("/",      role("employee"), applyLeave);    // Apply for leave
router.get("/my",     role("employee"), getOwnLeaves);  // View own leaves
router.put("/:id",    role("employee"), editLeave);     // Edit pending leave
router.delete("/:id", role("employee"), cancelLeave);   // Cancel pending leave

// Admin routes
router.get("/all",             role("admin"), getAllLeaves);   // View all leaves
router.patch("/:id/approve",   role("admin"), approveLeave);  // Approve a leave
router.patch("/:id/reject",    role("admin"), rejectLeave);   // Reject a leave

export default router;
