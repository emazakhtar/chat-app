// server/src/index.ts

// 1. Import required packages
import express, { Request, Response } from "express"; // Express: our web framework to handle routes.
import http from "http"; // Node's built-in HTTP module to create the server.
import cors from "cors"; // Allows cross-origin requests, which is necessary for our front-end to talk to our back-end.
import mongoose from "mongoose"; // Mongoose: to interact with our MongoDB database.
import { Server as SocketIOServer } from "socket.io"; // Socket.IO for real-time communication.

import { initializeSocket } from "./sockets"; // Our custom module which will configure Socket.IO, more on this later.
import { connectDB } from "./config/db"; // Our custom MongoDB connection logic.

// 2. Create an instance of Express app.
const app = express();

// 3. Configure middleware for JSON parsing and CORS.
app.use(express.json()); // This tells Express to use JSON for request bodies.
app.use(cors()); // Enable CORS so our React front-end can communicate with this server.

// 4. Setup a simple HTTP route for testing.
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, welcome to the chat app server!");
});

// 5. Connect to MongoDB using our config file.
connectDB();

// 6. Create an HTTP server using the Express app.
const server = http.createServer(app);

// 7. Initialize Socket.IO on the HTTP server.
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // In production, restrict this to your client URL.
    methods: ["GET", "POST"],
  },
});

// 8. Initialize custom Socket.IO events.
initializeSocket(io);

// 9. Start the server
const PORT = process.env.PORT || 5002; // Use environment variable if exists, otherwise 5000.
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
