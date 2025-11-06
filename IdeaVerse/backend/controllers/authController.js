import asyncHandler from "express-async-handler";
import crypto from "crypto";
import User from "../models/User.js";
import Token from "../models/Token.js";
import emailService from "../services/emailService.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

/**
 * Request password reset
 * POST /api/auth/request-password-reset
 */
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not for security
    return res.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent",
    });
  }

  // Delete any existing password reset tokens for this user
  await Token.deleteMany({ userId: user._id, type: "passwordReset" });

  // Generate token
  const resetToken = Token.generateToken();
  await Token.create({
    userId: user._id,
    token: resetToken,
    type: "passwordReset",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  // Send email
  try {
    await emailService.sendPasswordResetEmail(user.email, resetToken, user.name);
    logger.info(`Password reset email sent to: ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send password reset email: ${error.message}`);
    // Still return success to not reveal if email exists
  }

  res.json({
    success: true,
    message: "If an account exists with this email, a password reset link has been sent",
  });
});

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Hash token to find in database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const tokenDoc = await Token.findOne({
    token: hashedToken,
    type: "passwordReset",
    expiresAt: { $gt: new Date() },
  });

  if (!tokenDoc) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid or expired token", code: 400 },
    });
  }

  const user = await User.findById(tokenDoc.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found", code: 404 },
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Delete token
  await Token.deleteMany({ userId: user._id, type: "passwordReset" });

  logger.info(`Password reset successful for user: ${user.email}`);

  res.json({
    success: true,
    message: "Password reset successful. Please login with your new password.",
  });
});

/**
 * Request email verification
 * POST /api/auth/request-email-verify
 */
export const requestEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found", code: 404 },
    });
  }

  if (user.isEmailVerified) {
    return res.json({
      success: true,
      message: "Email is already verified",
    });
  }

  // Delete any existing verification tokens
  await Token.deleteMany({ userId: user._id, type: "emailVerification" });

  // Generate token
  const verificationToken = Token.generateToken();
  await Token.create({
    userId: user._id,
    token: verificationToken,
    type: "emailVerification",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Send email
  try {
    await emailService.sendVerificationEmail(user.email, verificationToken, user.name);
    logger.info(`Verification email sent to: ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send verification email: ${error.message}`);
    throw new Error("Failed to send verification email");
  }

  res.json({
    success: true,
    message: "Verification email sent. Please check your inbox.",
  });
});

/**
 * Verify email with token
 * GET /api/auth/verify-email?token=...
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: { message: "Token is required", code: 400 },
    });
  }

  const tokenDoc = await Token.findOne({
    token,
    type: "emailVerification",
    expiresAt: { $gt: new Date() },
  });

  if (!tokenDoc) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid or expired token", code: 400 },
    });
  }

  const user = await User.findById(tokenDoc.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found", code: 404 },
    });
  }

  // Verify email
  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();
  await user.save();

  // Delete token
  await Token.deleteMany({ userId: user._id, type: "emailVerification" });

  logger.info(`Email verified for user: ${user.email}`);

  res.json({
    success: true,
    message: "Email verified successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
  });
});

