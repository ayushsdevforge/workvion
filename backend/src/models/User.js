import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ──── User Schema ────
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "Full name is required"], trim: true },
    email:    { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"], minlength: 6, select: false }, // hidden by default
    role:           { type: String,  enum: ["employee", "admin"], default: "employee" },
    dateOfJoining:  { type: Date,    default: Date.now },
    leaveBalance:   { type: Number,  default: 20 },       // days per year
  },
  { timestamps: true }
);

// Hash password before saving (only when modified)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare a plain-text candidate with the stored hash
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
