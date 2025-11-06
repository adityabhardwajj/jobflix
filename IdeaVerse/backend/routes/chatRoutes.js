import express from "express";
import {
  getOrCreateProjectChat,
  getOrCreateJobChat,
  getUserChatRooms,
  getChatRoom,
  sendMessage,
  markAsRead,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validation.js";

const router = express.Router();

// All chat routes require authentication
router.use(protect);

router.get("/rooms", getUserChatRooms);
router.get("/rooms/:roomId", validateObjectId("roomId"), getChatRoom);
router.post("/rooms/:roomId/messages", validateObjectId("roomId"), sendMessage);
router.put("/rooms/:roomId/read", validateObjectId("roomId"), markAsRead);

// Project chat
router.get("/project/:ideaId", validateObjectId("ideaId"), getOrCreateProjectChat);

// Job chat
router.get("/job/:jobId", validateObjectId("jobId"), getOrCreateJobChat);

export default router;

