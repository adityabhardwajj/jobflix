import mongoose from "mongoose";

const applicationSchema = mongoose.Schema(
  {
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String },
    portfolioUrl: { type: String },
    expectedBudget: { type: String },
    status: { type: String, enum: ["applied","shortlisted","rejected","hired"], default: "applied" },
  },
  { timestamps: true }
);

const jobSchema = mongoose.Schema(
  {
    title: { type: String, required: true, index: "text" },
    description: { type: String, required: true, index: "text" },
    skills: [{ type: String, index: true }],
    budgetRange: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isRemote: { type: Boolean, default: true, index: true },
    location: { type: String, index: true },
    applications: [applicationSchema],
    status: { type: String, enum: ["open","closed","paused"], default: "open", index: true },
  },
  { timestamps: true }
);

// Create indexes
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ postedBy: 1, createdAt: -1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ isRemote: 1, location: 1 });
jobSchema.index({ "applications.applicant": 1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;

