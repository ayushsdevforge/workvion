import mongoose from "mongoose";
import crypto from "crypto";

// ──── OTP Schema ────
const otpSchema = new mongoose.Schema({
  email:   { type: String, required: true, lowercase: true, trim: true },
  otp:     { type: String, required: true },
  purpose: { type: String, enum: ["registration", "reset"], required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// Auto-delete expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Remove old OTPs for the same email + purpose before saving a new one
otpSchema.pre("save", async function () {
  await this.constructor.deleteMany({ email: this.email, purpose: this.purpose });
});

/**
 * Generate a 6-digit OTP, hash it, and create a document.
 * Returns the plain OTP (to send via email).
 */
otpSchema.statics.generate = async function (email, purpose) {
  const plain = crypto.randomInt(100000, 999999).toString();
  const hashed = crypto.createHash("sha256").update(plain).digest("hex");

  await this.create({
    email,
    otp: hashed,
    purpose,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  return plain;
};

/**
 * Verify a plain OTP against the stored hash.
 * Deletes the OTP document on successful verification.
 */
otpSchema.statics.verify = async function (email, plain, purpose) {
  const hashed = crypto.createHash("sha256").update(plain).digest("hex");

  const doc = await this.findOne({ email, otp: hashed, purpose, expiresAt: { $gt: new Date() } });
  if (!doc) return false;

  await doc.deleteOne();
  return true;
};

export default mongoose.model("Otp", otpSchema);
