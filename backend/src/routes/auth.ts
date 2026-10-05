// server/src/routes/auth.ts

import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const router = Router();

// POST /api/auth/register
// Endpoint to register a new user.
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Basic validation: make sure all fields are provided.
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the user already exists based on the email.
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with that email already exists." });
    }

    // Generate a salt and hash the password before storing.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with the hashed password.
    const user = new User({ username, email, password: hashedPassword });
    await user.save(); // Save the user to the database.

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST /api/auth/login
// Endpoint for user login.
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if both email and password are provided.
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find the user by email.
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare the plaintext password with the hashed password stored in the database.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // If password matches, create a JWT (JSON Web Token) for the session.
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret", // Use an environment variable for the secret in production.
      { expiresIn: "1h" }
    );

    // Send the token and basic user info back to the client.
    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
