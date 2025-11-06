import Idea from "../models/Idea.js";
import Job from "../models/Job.js";

/**
 * Check if user owns the resource or is admin
 */
export const checkOwnership = (resourceModel) => {
  return async (req, res, next) => {
    try {
      const resource = await resourceModel.findById(req.params.id);
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: { message: "Resource not found", code: 404 },
        });
      }

      // Admin can do anything
      if (req.user.role === "admin") {
        req.resource = resource;
        return next();
      }

      // Check ownership based on model
      let isOwner = false;
      if (resourceModel.modelName === "Idea") {
        isOwner = String(resource.createdBy) === String(req.user._id);
      } else if (resourceModel.modelName === "Job") {
        isOwner = String(resource.postedBy) === String(req.user._id);
      }

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: { message: "Not authorized to perform this action", code: 403 },
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user owns the comment or is admin
 */
export const checkCommentOwnership = async (req, res, next) => {
  try {
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

    // Admin can do anything
    if (req.user.role === "admin") {
      req.idea = idea;
      req.comment = comment;
      return next();
    }

    // Check if user owns the comment
    if (String(comment.user) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: { message: "Not authorized to perform this action", code: 403 },
      });
    }

    req.idea = idea;
    req.comment = comment;
    next();
  } catch (error) {
    next(error);
  }
};

