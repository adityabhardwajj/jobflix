import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Idea from "../models/Idea.js";
import Job from "../models/Job.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, role, search } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      users,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
      },
    },
  });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ success: false, error: { message: "User not found", code: 404 } });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ success: true, message: "User removed" });
  } else {
    res.status(404).json({ success: false, error: { message: "User not found", code: 404 } });
  }
});

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: { message: "User not found", code: 404 } });
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    success: true,
    data: { isBlocked: user.isBlocked },
    message: user.isBlocked ? "User blocked" : "User unblocked",
  });
});

// @desc    Get all ideas
// @route   GET /api/admin/ideas
// @access  Private/Admin
export const getAllIdeas = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search, status } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (status) query.status = status;

  const [ideas, total] = await Promise.all([
    Idea.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Idea.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      ideas,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
      },
    },
  });
});

// @desc    Delete idea (admin)
// @route   DELETE /api/admin/ideas/:id
// @access  Private/Admin
export const deleteIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) {
    return res.status(404).json({ success: false, error: { message: "Idea not found", code: 404 } });
  }

  await idea.deleteOne();
  res.json({ success: true, message: "Idea deleted" });
});

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
export const getAllJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search, status } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (status) query.status = status;

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Job.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      jobs,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
      },
    },
  });
});

// @desc    Delete job (admin)
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, error: { message: "Job not found", code: 404 } });
  }

  await job.deleteOne();
  res.json({ success: true, message: "Job deleted" });
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalIdeas = await Idea.countDocuments();
  const totalJobs = await Job.countDocuments();

  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $project: { _id: 0, role: "$_id", count: 1 } },
  ]);

  const usersByRoleMap = usersByRole.reduce((acc, item) => {
    acc[item.role] = item.count;
    return acc;
  }, {});

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("-password");
  const recentIdeas = await Idea.find().populate("createdBy", "name").sort({ createdAt: -1 }).limit(5);
  const recentJobs = await Job.find().populate("postedBy", "name").sort({ createdAt: -1 }).limit(5);

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalIdeas,
        totalJobs,
        usersByRole: usersByRoleMap,
      },
      recent: {
        users: recentUsers,
        ideas: recentIdeas,
        jobs: recentJobs,
      },
    },
  });
});
