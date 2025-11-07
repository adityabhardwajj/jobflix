import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import Token from "../models/Token.js";
import emailService from "../services/emailService.js";
import logger from "../utils/logger.js";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = async (userId, deviceInfo = {}) => {
  const token = RefreshToken.generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await RefreshToken.create({
    token,
    userId,
    expiresAt,
    deviceInfo,
  });

  return token;
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: { message: "Refresh token is required", code: 400 },
    });
  }

  const tokenDoc = await RefreshToken.findOne({
    token: refreshToken,
    revoked: false,
    expiresAt: { $gt: new Date() },
  }).populate("userId");

  if (!tokenDoc || !tokenDoc.userId) {
    return res.status(401).json({
      success: false,
      error: { message: "Invalid or expired refresh token", code: 401 },
    });
  }

  // Check if user is blocked
  if (tokenDoc.userId.isBlocked) {
    await RefreshToken.updateOne({ _id: tokenDoc._id }, { revoked: true });
    return res.status(403).json({
      success: false,
      error: { message: "Account has been blocked", code: 403 },
    });
  }

  // Generate new access token
  const accessToken = generateAccessToken(tokenDoc.userId._id);

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken: tokenDoc.token, // Return same refresh token
    },
  });
});

// @desc    Revoke refresh token (logout)
// @route   POST /api/auth/revoke
// @access  Private
export const revokeRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const userId = req.user._id;

  if (refreshToken) {
    await RefreshToken.updateOne(
      { token: refreshToken, userId },
      { revoked: true }
    );
  } else {
    // Revoke all tokens for this user
    await RefreshToken.updateMany({ userId }, { revoked: true });
  }

  res.json({
    success: true,
    message: "Token revoked successfully",
  });
});

// @desc    Request password reset
// @route   POST /api/auth/request-password-reset
// @access  Public
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists for security
    return res.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    });
  }

  // Generate reset token
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
  }

  res.json({
    success: true,
    message: "If an account exists with this email, a password reset link has been sent.",
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const tokenDoc = await Token.findOne({
    token,
    type: "passwordReset",
    expiresAt: { $gt: new Date() },
  });

  if (!tokenDoc) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid or expired reset token", code: 400 },
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

  // Delete the token
  await Token.deleteOne({ _id: tokenDoc._id });

  // Revoke all refresh tokens for security
  await RefreshToken.updateMany({ userId: user._id }, { revoked: true });

  logger.info(`Password reset successful for user: ${user.email}`);

  res.json({
    success: true,
    message: "Password reset successfully",
  });
});

// @desc    Request email verification
// @route   POST /api/auth/request-email-verify
// @access  Private
export const requestEmailVerification = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      error: { message: "Email already verified", code: 400 },
    });
  }

  // Generate verification token
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
  }

  res.json({
    success: true,
    message: "Verification email sent",
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const tokenDoc = await Token.findOne({
    token,
    type: "emailVerification",
    expiresAt: { $gt: new Date() },
  });

  if (!tokenDoc) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid or expired verification token", code: 400 },
    });
  }

  const user = await User.findById(tokenDoc.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found", code: 404 },
    });
  }

  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();
  await user.save();

  // Delete the token
  await Token.deleteOne({ _id: tokenDoc._id });

  logger.info(`Email verified for user: ${user.email}`);

  res.json({
    success: true,
    message: "Email verified successfully",
  });
});

export { generateAccessToken, generateRefreshToken };
