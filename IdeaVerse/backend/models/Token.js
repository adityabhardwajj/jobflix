import mongoose from "mongoose";
import crypto from "crypto";

const tokenSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["emailVerification", "passwordReset"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: { expireAfterSeconds: 0 }, // TTL index
    },
  },
  { timestamps: true }
);

// Generate random token
tokenSchema.statics.generateToken = function () {
  return crypto.randomBytes(32).toString("hex");
};

// Hash token before saving
tokenSchema.pre("save", async function (next) {
  if (!this.isModified("token")) return next();
  // For password reset, we'll store hashed token
  if (this.type === "passwordReset") {
    this.token = crypto.createHash("sha256").update(this.token).digest("hex");
  }
  next();
});

// Method to verify token (for password reset)
tokenSchema.methods.verifyToken = function (plainToken) {
  if (this.type === "passwordReset") {
    const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");
    return this.token === hashedToken;
  }
  return this.token === plainToken;
};

const Token = mongoose.model("Token", tokenSchema);

export default Token;

