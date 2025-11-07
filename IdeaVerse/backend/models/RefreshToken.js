import mongoose from "mongoose";
import crypto from "crypto";

const refreshTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index
    },
    deviceInfo: {
      userAgent: String,
      ip: String,
    },
    revoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Generate a secure random token
refreshTokenSchema.statics.generateToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

// Create compound index for efficient queries
refreshTokenSchema.index({ userId: 1, revoked: 1 });
refreshTokenSchema.index({ token: 1, revoked: 1 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;

