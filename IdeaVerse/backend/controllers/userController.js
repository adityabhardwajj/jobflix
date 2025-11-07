import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Idea from "../models/Idea.js";
import Job from "../models/Job.js";
import Token from "../models/Token.js";
import emailService from "../services/emailService.js";
import logger from "../utils/logger.js";
import { generateAccessToken, generateRefreshToken } from "./authController.js";

// Register new user
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({
      success: false,
      error: { message: "User already exists", code: 400 },
    });
  }

  const user = await User.create({ name, email, password, role });

  // Generate email verification token
  const verificationToken = Token.generateToken();
  await Token.create({
    userId: user._id,
    token: verificationToken,
    type: "emailVerification",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Send verification email
  try {
    await emailService.sendVerificationEmail(user.email, verificationToken, user.name);
    logger.info(`Verification email sent to: ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send verification email: ${error.message}`);
    // Don't fail registration if email fails
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id, {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token: accessToken,
      refreshToken,
    },
    message: "Registration successful. Please check your email to verify your account.",
  });
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    logger.warn(`Login attempt failed: User not found - ${email}`);
    return res.status(401).json({
      success: false,
      error: { message: "Invalid credentials", code: 401 },
    });
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    logger.warn(`Login attempt failed: Invalid password - ${email}`);
    return res.status(401).json({
      success: false,
      error: { message: "Invalid credentials", code: 401 },
    });
  }

          logger.info(`User logged in: ${user.email}`);

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id, {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token: accessToken,
      refreshToken,
    },
  });
});

// Get profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

// Get user dashboard data
export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [user, userIdeas, userJobs, applications] = await Promise.all([
    User.findById(userId).select("-password"),
    Idea.find({ createdBy: userId }).sort({ createdAt: -1 }),
    Job.find({ postedBy: userId }).sort({ createdAt: -1 }),
    Job.find({ "applications.applicant": userId })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 }),
  ]);

  // Get application details
  const applicationDetails = applications.map((job) => {
    const application = job.applications.find(
      (app) => String(app.applicant) === String(userId)
    );
    return {
      job: {
        _id: job._id,
        title: job.title,
        postedBy: job.postedBy,
      },
      application: application,
    };
  });

  res.json({
    success: true,
    data: {
      user,
      stats: {
        ideasCount: userIdeas.length,
        jobsPostedCount: userJobs.length,
        applicationsCount: applicationDetails.length,
      },
      ideas: userIdeas,
      jobsPosted: userJobs,
      applications: applicationDetails,
    },
  });
});

// Update profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, headline, bio, skills } = req.body;

  if (name) user.name = name;
  if (email) {
    const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
    user.email = email;
  }
  if (headline !== undefined) user.headline = headline;
  if (bio !== undefined) user.bio = bio;
  if (skills !== undefined) user.skills = skills;

  const updatedUser = await user.save();
  res.json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      headline: updatedUser.headline,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      isEmailVerified: updatedUser.isEmailVerified,
    },
  });
});
