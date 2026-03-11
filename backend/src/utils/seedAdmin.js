import User from "../models/User.js";

export const seed = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL) return;

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
};
