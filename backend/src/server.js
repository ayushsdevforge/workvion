import "dotenv/config"; // Load .env variables into process.env
import app from "./app.js";
import connectDB from "./config/db.js";
import {seed} from "./utils/seedAdmin.js";

const PORT = process.env.PORT || 5000;

/** Start the server: connect to DB first, then listen */
const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  await seed(); // Seed admin user after server starts
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
