import express from "express";
import {
  requestPasswordReset,
  resetPassword,
  requestEmailVerification,
  verifyEmail,
} from "../controllers/authController.js";
import {
  validatePasswordReset,
  validateResetPassword,
} from "../middleware/validation.js";
import { authRateLimiter, passwordResetRateLimiter } from "../middleware/security.js";

const router = express.Router();

router.post(
  "/request-password-reset",
  authRateLimiter,
  validatePasswordReset,
  requestPasswordReset
);

router.post(
  "/reset-password",
  passwordResetRateLimiter,
  validateResetPassword,
  resetPassword
);

router.post("/request-email-verify", requestEmailVerification);

router.get("/verify-email", verifyEmail);

export default router;

