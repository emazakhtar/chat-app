// server/src/sockets/index.ts

import { Server, Socket } from "socket.io";

// We'll maintain an in-memory map for online users for simplicity. In production, you may want a more robust solution.
const onlineUsers = new Map<string, string>(); // key: userId, value: socket.id

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A new client connected:", socket.id);

    // When a client registers their userId after connecting.
    socket.on("register", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle joining a chat room.
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle sending a chat message.
    socket.on(
      "chatMessage",
      (data: {
        senderId: string;
        receiverId: string;
        roomId: string;
        text: string;
      }) => {
        // Emit the message to everyone in the room.
        io.to(data.roomId).emit("newMessage", data);
        console.log(
          `Message from ${data.senderId} to room ${data.roomId}: ${data.text}`
        );

        // If you want to also notify the receiver specifically even if they haven't joined,
        // you can emit the message directly using their socket id.
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId && receiverSocketId !== socket.id) {
          io.to(receiverSocketId).emit("notification", data);
          console.log(
            `Notification sent to user ${data.receiverId} at socket ${receiverSocketId}`
          );
        }
      }
    );

    // Clean up when a socket disconnects.
    socket.on("disconnect", () => {
      // Remove disconnected socket from onlineUsers map.
      onlineUsers.forEach((id, userId) => {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          console.log(
            `User ${userId} disconnected and removed from online users.`
          );
        }
      });
    });
  });
};
