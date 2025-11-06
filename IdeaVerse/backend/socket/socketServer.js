import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ChatRoom from "../models/ChatRoom.js";

/**
 * Initialize Socket.io server with authentication and chat handling
 */
export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.userId})`);

    // Join user's personal room for notifications
    socket.join(`user:${socket.userId}`);

    // Join chat room
    socket.on("join-room", async (roomId) => {
      try {
        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
          return socket.emit("error", { message: "Chat room not found" });
        }

        // Check if user is a participant
        const isParticipant = chatRoom.participants.some(
          (p) => String(p.user) === socket.userId
        );

        if (!isParticipant && socket.user.role !== "admin") {
          return socket.emit("error", { message: "Access denied" });
        }

        socket.join(`room:${roomId}`);
        socket.emit("joined-room", { roomId });

        // Notify others in the room
        socket.to(`room:${roomId}`).emit("user-joined", {
          userId: socket.userId,
          userName: socket.user.name,
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Leave chat room
    socket.on("leave-room", (roomId) => {
      socket.leave(`room:${roomId}`);
      socket.emit("left-room", { roomId });
    });

    // Send message
    socket.on("send-message", async (data) => {
      try {
        const { roomId, text, attachments } = data;

        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
          return socket.emit("error", { message: "Chat room not found" });
        }

        // Check if user is a participant
        const isParticipant = chatRoom.participants.some(
          (p) => String(p.user) === socket.userId
        );

        if (!isParticipant && socket.user.role !== "admin") {
          return socket.emit("error", { message: "Access denied" });
        }

        // Create message
        const message = {
          sender: socket.userId,
          text: text.trim(),
          readBy: [{ user: socket.userId, readAt: new Date() }],
          attachments: attachments || [],
        };

        chatRoom.messages.push(message);
        chatRoom.lastMessageAt = new Date();
        await chatRoom.save();

        await chatRoom.populate("messages.sender", "name email role avatar");

        const newMessage = chatRoom.messages[chatRoom.messages.length - 1];

        // Emit to all users in the room
        io.to(`room:${roomId}`).emit("new-message", {
          roomId,
          message: newMessage,
        });

        // Notify participants who are not in the room
        chatRoom.participants.forEach((participant) => {
          if (String(participant.user) !== socket.userId) {
            io.to(`user:${participant.user}`).emit("chat-notification", {
              roomId,
              message: newMessage,
            });
          }
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { roomId } = data;
      socket.to(`room:${roomId}`).emit("user-typing", {
        userId: socket.userId,
        userName: socket.user.name,
        roomId,
      });
    });

    socket.on("stop-typing", (data) => {
      const { roomId } = data;
      socket.to(`room:${roomId}`).emit("user-stopped-typing", {
        userId: socket.userId,
        roomId,
      });
    });

    // Mark messages as read
    socket.on("mark-read", async (data) => {
      try {
        const { roomId } = data;
        const chatRoom = await ChatRoom.findById(roomId);

        if (!chatRoom) {
          return socket.emit("error", { message: "Chat room not found" });
        }

        chatRoom.messages.forEach((message) => {
          const alreadyRead = message.readBy.some(
            (read) => String(read.user) === String(socket.userId)
          );
          if (!alreadyRead) {
            message.readBy.push({ user: socket.userId, readAt: new Date() });
          }
        });

        await chatRoom.save();

        socket.emit("marked-read", { roomId });
      } catch (error) {
        socket.emit("error", { message: "Failed to mark as read" });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.userId})`);
    });
  });

  return io;
};

