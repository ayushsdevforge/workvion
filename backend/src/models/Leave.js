import mongoose from "mongoose";

// Allowed leave categories
export const LEAVE_TYPES = [
  "Casual Leave", "Sick Leave", "Earned Leave",
  "Maternity Leave", "Paternity Leave", "Unpaid Leave",
];

// ──── Leave Schema ────
const leaveSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    leaveType:   { type: String,  enum: LEAVE_TYPES, required: [true, "Leave type is required"] },
    startDate:   { type: Date,    required: [true, "Start date is required"] },
    endDate:     { type: Date,    required: [true, "End date is required"] },
    totalDays:   { type: Number,  required: true },
    status:      { type: String,  enum: ["pending", "approved", "rejected"], default: "pending" },
    reason:      { type: String,  required: [true, "Reason is required"], trim: true },
    appliedDate: { type: Date,    default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
