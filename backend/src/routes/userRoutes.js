import { Router } from "express";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = Router();

// All user management routes are admin-only
router.use(auth, role("admin"));

router.post("/",      createUser);    // Create user
router.get("/",       getAllUsers);   // List all users
router.get("/:id",    getUserById);  // Get single user
router.put("/:id",    updateUser);   // Update user
router.delete("/:id", deleteUser);   // Delete user + related data

export default router;
