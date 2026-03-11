import mongoose from "mongoose";

// ──── Attendance Schema ────
const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date:   { type: Date,   required: [true, "Date is required"] },
    status: { type: String,  enum: ["present", "absent"], required: [true, "Status is required"] },
  },
  { timestamps: true }
);

// One record per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
