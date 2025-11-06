import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { setupHelmet, setupCors, globalRateLimiter } from "./middleware/security.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
import userRoutes from "./routes/userRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import swaggerSetup from "./docs/swagger.js";
import { initializeSocket } from "./socket/socketServer.js";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

// Security middleware
app.use(setupHelmet());
app.use(setupCors());

// Body parser with size limit
app.use(express.json({ limit: process.env.BODY_SIZE_LIMIT || "100kb" }));
app.use(express.urlencoded({ extended: true, limit: process.env.BODY_SIZE_LIMIT || "100kb" }));

// Global rate limiting
app.use(globalRateLimiter);

// Swagger documentation
swaggerSetup(app);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🌌 IdeaVerse API is running...",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Initialize Socket.io
const io = initializeSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Documentation available at http://localhost:${PORT}/api/docs`);
  logger.info(`💬 Socket.io server initialized`);
});

export { io };
