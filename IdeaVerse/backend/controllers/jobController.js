import asyncHandler from "express-async-handler";
import Job from "../models/Job.js";

export const createJob = asyncHandler(async (req, res) => {
  const { title, description, skills, budgetRange, isRemote, location } = req.body;
  const job = new Job({
    title,
    description,
    skills: skills || [],
    budgetRange,
    isRemote: isRemote !== undefined ? isRemote : true,
    location,
    postedBy: req.user._id,
  });
  const created = await job.save();
  await created.populate("postedBy", "name role");

  res.status(201).json({
    success: true,
    data: created,
  });
});

export const getJobs = asyncHandler(async (req, res) => {
  const {
    search,
    skills,
    location,
    remote,
    page = 1,
    limit = 20,
    sort = "createdAt_desc",
  } = req.query;

  // Build query
  const query = { status: "open" };

  // Search
  if (search) {
    query.$text = { $search: search };
  }

  // Skills filter
  if (skills) {
    const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills;
    query.skills = { $in: skillsArray };
  }

  // Location filter
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // Remote filter
  if (remote !== undefined) {
    query.isRemote = remote === "true" || remote === true;
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
  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate("postedBy", "name role")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Job.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: jobs,
    meta: {
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
    },
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("postedBy", "name role")
    .populate("applications.applicant", "name email");

  if (!job) {
    return res.status(404).json({
      success: false,
      error: { message: "Job not found", code: 404 },
    });
  }

  res.json({
    success: true,
    data: job,
  });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: { message: "Job not found", code: 404 },
    });
  }

  // Check ownership (recruiter or admin)
  if (
    String(job.postedBy) !== String(req.user._id) &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      error: { message: "Not authorized to update this job", code: 403 },
    });
  }

  // Update fields
  const { title, description, skills, budgetRange, isRemote, location, status } = req.body;
  if (title !== undefined) job.title = title;
  if (description !== undefined) job.description = description;
  if (skills !== undefined) job.skills = skills;
  if (budgetRange !== undefined) job.budgetRange = budgetRange;
  if (isRemote !== undefined) job.isRemote = isRemote;
  if (location !== undefined) job.location = location;
  if (status !== undefined) job.status = status;

  const updated = await job.save();
  await updated.populate("postedBy", "name role");

  res.json({
    success: true,
    data: updated,
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: { message: "Job not found", code: 404 },
    });
  }

  // Check ownership (recruiter or admin)
  if (
    String(job.postedBy) !== String(req.user._id) &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      error: { message: "Not authorized to delete this job", code: 403 },
    });
  }

  await job.deleteOne();

  res.json({
    success: true,
    message: "Job deleted successfully",
  });
});

export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: { message: "Job not found", code: 404 },
    });
  }

  if (job.status !== "open") {
    return res.status(400).json({
      success: false,
      error: { message: "This job is no longer accepting applications", code: 400 },
    });
  }

  // Check if already applied
  const existing = job.applications.find(
    (a) => String(a.applicant) === String(req.user._id)
  );
  if (existing) {
    return res.status(400).json({
      success: false,
      error: { message: "You have already applied to this job", code: 400 },
    });
  }

  job.applications.push({
    applicant: req.user._id,
    coverLetter: req.body.coverLetter || "",
    portfolioUrl: req.body.portfolioUrl || "",
    expectedBudget: req.body.expectedBudget || "",
  });

  await job.save();

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
  });
});

export const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "applications.applicant",
    "name email headline skills"
  );

  if (!job) {
    return res.status(404).json({
      success: false,
      error: { message: "Job not found", code: 404 },
    });
  }

  // Check ownership
  if (String(job.postedBy) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Not authorized to view applications", code: 403 },
    });
  }

  res.json({
    success: true,
    data: job.applications,
  });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["applied", "shortlisted", "rejected", "hired"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid status", code: 400 },
    });
  }

  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: { message: "Job not found", code: 404 },
    });
  }

  // Check ownership
  if (String(job.postedBy) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Not authorized to update application status", code: 403 },
    });
  }

  const application = job.applications.id(req.params.applicationId);
  if (!application) {
    return res.status(404).json({
      success: false,
      error: { message: "Application not found", code: 404 },
    });
  }

  application.status = status;
  await job.save();

  res.json({
    success: true,
    data: application,
  });
});
