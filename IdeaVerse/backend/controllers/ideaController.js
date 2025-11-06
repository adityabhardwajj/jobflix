import asyncHandler from "express-async-handler";
import Idea from "../models/Idea.js";
import { validateObjectId } from "../middleware/validation.js";

export const createIdea = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  const idea = new Idea({
    title,
    description,
    tags: tags || [],
    createdBy: req.user._id,
  });
  const created = await idea.save();
  await created.populate("createdBy", "name email role");
  
  res.status(201).json({
    success: true,
    data: created,
  });
});

export const getIdeas = asyncHandler(async (req, res) => {
  const {
    search,
    tags,
    page = 1,
    limit = 20,
    sort = "createdAt_desc",
  } = req.query;

  // Build query
  const query = {};

  // Search
  if (search) {
    query.$text = { $search: search };
  }

  // Tags filter
  if (tags) {
    const tagArray = typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;
    query.tags = { $in: tagArray };
  }

  // Sort
  const [sortField, sortOrder] = sort.split("_");
  const sortOptions = {};
  sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const [ideas, total] = await Promise.all([
    Idea.find(query)
      .populate("createdBy", "name email role")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Idea.countDocuments(query),
  ]);

  // Map createdBy to author for frontend compatibility
  const ideasWithAuthor = ideas.map((idea) => {
    if (idea.createdBy && !idea.author) {
      idea.author = idea.createdBy;
    }
    return idea;
  });

  res.json({
    success: true,
    data: ideasWithAuthor,
    meta: {
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
    },
  });
});

export const getIdeaById = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id)
    .populate("createdBy", "name email role")
    .populate("comments.user", "name email");

  if (!idea) {
    return res.status(404).json({
      success: false,
      error: { message: "Idea not found", code: 404 },
    });
  }

  // Map createdBy to author for frontend compatibility
  const ideaObj = idea.toObject();
  if (ideaObj.createdBy && !ideaObj.author) {
    ideaObj.author = ideaObj.createdBy;
  }

  res.json({
    success: true,
    data: ideaObj,
  });
});

export const updateIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) {
    return res.status(404).json({
      success: false,
      error: { message: "Idea not found", code: 404 },
    });
  }

  // Check ownership
  if (String(idea.createdBy) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Not authorized to update this idea", code: 403 },
    });
  }

  // Update fields
  const { title, description, tags } = req.body;
  if (title !== undefined) idea.title = title;
  if (description !== undefined) idea.description = description;
  if (tags !== undefined) idea.tags = tags;

  const updated = await idea.save();
  await updated.populate("createdBy", "name email role");

  res.json({
    success: true,
    data: updated,
  });
});

export const deleteIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) {
    return res.status(404).json({
      success: false,
      error: { message: "Idea not found", code: 404 },
    });
  }

  // Check ownership
  if (String(idea.createdBy) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Not authorized to delete this idea", code: 403 },
    });
  }

  await idea.deleteOne();

  res.json({
    success: true,
    message: "Idea deleted successfully",
  });
});

export const likeIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) {
    return res.status(404).json({
      success: false,
      error: { message: "Idea not found", code: 404 },
    });
  }

  const alreadyLiked = idea.likes.some(
    (id) => id.toString() === req.user._id.toString()
  );

  if (alreadyLiked) {
    idea.likes = idea.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  } else {
    idea.likes.push(req.user._id);
  }

  await idea.save();

  res.json({
    success: true,
    data: { likesCount: idea.likes.length, liked: !alreadyLiked },
  });
});

export const commentOnIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) {
    return res.status(404).json({
      success: false,
      error: { message: "Idea not found", code: 404 },
    });
  }

  idea.comments.push({
    user: req.user._id,
    text: req.body.text,
  });

  await idea.save();
  await idea.populate("comments.user", "name email");

  const newComment = idea.comments[idea.comments.length - 1];

  res.status(201).json({
    success: true,
    data: newComment,
  });
});

export const updateComment = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId);
  if (!idea) {
    return res.status(404).json({
      success: false,
      error: { message: "Idea not found", code: 404 },
    });
  }

  const comment = idea.comments.id(req.params.commentId);
  if (!comment) {
    return res.status(404).json({
      success: false,
      error: { message: "Comment not found", code: 404 },
    });
  }

  // Check ownership
  if (String(comment.user) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Not authorized to update this comment", code: 403 },
    });
  }

  comment.text = req.body.text;
  await idea.save();
  await idea.populate("comments.user", "name email");

  res.json({
    success: true,
    data: comment,
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId);
  if (!idea) {
    return res.status(404).json({
      success: false,
      error: { message: "Idea not found", code: 404 },
    });
  }

  const comment = idea.comments.id(req.params.commentId);
  if (!comment) {
    return res.status(404).json({
      success: false,
      error: { message: "Comment not found", code: 404 },
    });
  }

  // Check ownership
  if (String(comment.user) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Not authorized to delete this comment", code: 403 },
    });
  }

  comment.deleteOne();
  await idea.save();

  res.json({
    success: true,
    message: "Comment deleted successfully",
  });
});
