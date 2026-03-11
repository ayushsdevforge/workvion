import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

// ── Global middleware ──────────────────────────────────
app.use(express.json());  // Parse JSON request bodies
app.use(cors());          // Allow cross-origin requests

// ── Health check ───────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Workvion API is running" });
});

// ── API routes ─────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/users",      userRoutes);
app.use("/api/leaves",     leaveRoutes);
app.use("/api/attendance", attendanceRoutes);

// ── Error handling ─────────────────────────────────────
app.use(notFound);      // 404 for unmatched routes
app.use(errorHandler);  // Global error catcher

export default app;
