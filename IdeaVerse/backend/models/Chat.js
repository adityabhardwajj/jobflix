import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    readBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now },
      },
    ],
    attachments: [
      {
        url: String,
        filename: String,
        fileType: String,
        size: Number,
      },
    ],
  },
  { timestamps: true }
);

const chatRoomSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["project", "job", "direct"],
      required: true,
      index: true,
    },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["creator", "freelancer", "recruiter", "admin"] },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    relatedTo: {
      idea: { type: mongoose.Schema.Types.ObjectId, ref: "Idea" },
      job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    },
    messages: [messageSchema],
    lastMessageAt: { type: Date, default: Date.now, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Indexes for efficient queries
chatRoomSchema.index({ participants: 1, lastMessageAt: -1 });
chatRoomSchema.index({ type: 1, relatedTo: 1 });
chatRoomSchema.index({ isActive: 1, lastMessageAt: -1 });

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;

