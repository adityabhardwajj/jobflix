import asyncHandler from "express-async-handler";
import ChatRoom from "../models/ChatRoom.js";
import Idea from "../models/Idea.js";
import Job from "../models/Job.js";
import { validateObjectId } from "../middleware/validation.js";

/**
 * Get or create chat room for an idea/project
 */
export const getOrCreateProjectChat = asyncHandler(async (req, res) => {
  const { ideaId } = req.params;
  const userId = req.user._id;

  const idea = await Idea.findById(ideaId);
  if (!idea) {
    return res.status(404).json({
      success: false,
      error: { message: "Idea not found", code: 404 },
    });
  }

  // Check if user has access (creator or collaborator)
  const hasAccess =
    String(idea.createdBy) === String(userId) ||
    idea.collaborators?.some((id) => String(id) === String(userId)) ||
    req.user.role === "admin";

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      error: { message: "Access denied to this project chat", code: 403 },
    });
  }

  let chatRoom = await ChatRoom.findOne({
    type: "project",
    "relatedTo.idea": ideaId,
    isActive: true,
  }).populate("participants.user", "name email role");

  if (!chatRoom) {
    // Create new chat room
    const participants = [
      {
        user: idea.createdBy,
        role: "creator",
      },
    ];

    if (idea.collaborators && idea.collaborators.length > 0) {
      idea.collaborators.forEach((collabId) => {
        participants.push({ user: collabId, role: "collaborator" });
      });
    }

    // Add current user if not already included
    if (!participants.some((p) => String(p.user) === String(userId))) {
      participants.push({ user: userId, role: req.user.role });
    }

    chatRoom = await ChatRoom.create({
      name: `Project: ${idea.title}`,
      type: "project",
      participants,
      relatedTo: { idea: ideaId },
      messages: [],
    });

    await chatRoom.populate("participants.user", "name email role");
  }

  res.json({
    success: true,
    data: chatRoom,
  });
});

/**
 * Get or create chat room for a job
 */
export const getOrCreateJobChat = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await Job.findById(jobId).populate("postedBy", "_id");
  if (!job) {
    return res.status(404).json({
      success: false,
      error: { message: "Job not found", code: 404 },
    });
  }

  // Check if user has access (recruiter or applicant)
  const isRecruiter = String(job.postedBy._id) === String(userId);
  const isApplicant = job.applications?.some(
    (app) => String(app.applicant) === String(userId)
  );
  const hasAccess = isRecruiter || isApplicant || req.user.role === "admin";

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      error: { message: "Access denied to this job chat", code: 403 },
    });
  }

  let chatRoom = await ChatRoom.findOne({
    type: "job",
    "relatedTo.job": jobId,
    isActive: true,
  }).populate("participants.user", "name email role");

  if (!chatRoom) {
    const participants = [{ user: job.postedBy, role: "recruiter" }];

    // Add applicant if current user is applicant
    if (isApplicant) {
      participants.push({ user: userId, role: "freelancer" });
    }

    chatRoom = await ChatRoom.create({
      name: `Job: ${job.title}`,
      type: "job",
      participants,
      relatedTo: { job: jobId },
      messages: [],
    });

    await chatRoom.populate("participants.user", "name email role");
  }

  res.json({
    success: true,
    data: chatRoom,
  });
});

/**
 * Get user's chat rooms
 */
export const getUserChatRooms = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { type } = req.query;

  const query = {
    "participants.user": userId,
    isActive: true,
  };

  if (type && ["project", "job", "direct"].includes(type)) {
    query.type = type;
  }

  const chatRooms = await ChatRoom.find(query)
    .populate("participants.user", "name email role avatar")
    .populate("relatedTo.idea", "title")
    .populate("relatedTo.job", "title")
    .sort({ lastMessageAt: -1 })
    .limit(50);

  res.json({
    success: true,
    data: chatRooms,
  });
});

/**
 * Get chat room by ID
 */
export const getChatRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;

  const chatRoom = await ChatRoom.findById(roomId)
    .populate("participants.user", "name email role avatar")
    .populate("messages.sender", "name email role avatar")
    .populate("relatedTo.idea", "title")
    .populate("relatedTo.job", "title");

  if (!chatRoom) {
    return res.status(404).json({
      success: false,
      error: { message: "Chat room not found", code: 404 },
    });
  }

  // Check if user is a participant
  const isParticipant = chatRoom.participants.some(
    (p) => String(p.user._id) === String(userId)
  );

  if (!isParticipant && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Access denied", code: 403 },
    });
  }

  // Mark messages as read for this user
  chatRoom.messages.forEach((message) => {
    const alreadyRead = message.readBy.some(
      (read) => String(read.user) === String(userId)
    );
    if (!alreadyRead) {
      message.readBy.push({ user: userId, readAt: new Date() });
    }
  });

  await chatRoom.save();

  res.json({
    success: true,
    data: chatRoom,
  });
});

/**
 * Send message (used by Socket.io, also available as REST endpoint)
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { text, attachments } = req.body;
  const userId = req.user._id;

  const chatRoom = await ChatRoom.findById(roomId);
  if (!chatRoom) {
    return res.status(404).json({
      success: false,
      error: { message: "Chat room not found", code: 404 },
    });
  }

  // Check if user is a participant
  const isParticipant = chatRoom.participants.some(
    (p) => String(p.user) === String(userId)
  );

  if (!isParticipant && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Access denied", code: 403 },
    });
  }

  const message = {
    sender: userId,
    text: text.trim(),
    readBy: [{ user: userId, readAt: new Date() }],
    attachments: attachments || [],
  };

  chatRoom.messages.push(message);
  chatRoom.lastMessageAt = new Date();
  await chatRoom.save();

  await chatRoom.populate("messages.sender", "name email role avatar");

  const newMessage = chatRoom.messages[chatRoom.messages.length - 1];

  res.status(201).json({
    success: true,
    data: newMessage,
  });
});

/**
 * Mark messages as read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;

  const chatRoom = await ChatRoom.findById(roomId);
  if (!chatRoom) {
    return res.status(404).json({
      success: false,
      error: { message: "Chat room not found", code: 404 },
    });
  }

  chatRoom.messages.forEach((message) => {
    const alreadyRead = message.readBy.some(
      (read) => String(read.user) === String(userId)
    );
    if (!alreadyRead) {
      message.readBy.push({ user: userId, readAt: new Date() });
    }
  });

  await chatRoom.save();

  res.json({
    success: true,
    message: "Messages marked as read",
  });
});

