import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const ideaSchema = mongoose.Schema(
  {
    title: { type: String, required: true, index: "text" },
    description: { type: String, required: true, index: "text" },
    tags: [{ type: String, index: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Create indexes
ideaSchema.index({ title: "text", description: "text" });
ideaSchema.index({ createdBy: 1, createdAt: -1 });
ideaSchema.index({ tags: 1 });
ideaSchema.index({ createdAt: -1 });
ideaSchema.index({ "likes": 1 });

const Idea = mongoose.model("Idea", ideaSchema);
export default Idea;
