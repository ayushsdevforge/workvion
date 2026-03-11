import "dotenv/config"; // Load .env variables
import mongoose from "mongoose";
import User from "./src/models/User.js";


const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  const adminExists = await User.findOne({ email: ADMIN_EMAIL });

  if (!adminExists) {
    await User.create({
      fullName: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`Admin seeded: ${ADMIN_EMAIL}`);
  } else {
    console.log("Admin already exists. Skipping.");
  }

  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
