// server/src/config/db.ts

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Replace <your-mongodb-uri> with your actual MongoDB connection string
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/chat-app";

    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};
