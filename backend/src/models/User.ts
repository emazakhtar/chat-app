// server/src/models/User.ts

// Import mongoose and types for TypeScript.
import mongoose, { Schema, Document } from "mongoose";

// Define an interface that represents a user document in MongoDB.
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

// Define the user schema using Mongoose's Schema constructor.
// This schema defines how a user's data is structured.
const UserSchema: Schema = new Schema(
  {
    // 'username' must be a string and is required.
    username: { type: String, required: true },

    // 'email' must be a string, is required, and must be unique.
    email: { type: String, required: true, unique: true },

    // 'password' must be a string and is required.
    password: { type: String, required: true },
  },
  {
    // Timestamps automatically creates 'createdAt' and 'updatedAt' fields.
    timestamps: true,
  }
);

// Create and export the model based on the schema.
// This model will be used to interact with the 'users' collection in MongoDB.
export default mongoose.model<IUser>("User", UserSchema);
