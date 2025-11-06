import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import logger from "../utils/logger.js";

/**
 * Configure Helmet for security headers
 */
export const setupHelmet = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  });
};

/**
 * Configure CORS
 */
export const setupCors = () => {
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["http://localhost:5173", "http://localhost:3000"];

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
};

/**
 * Global rate limiter
 */
export const globalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "15") * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"), // 100 requests per window
  message: {
    success: false,
    error: {
      message: "Too many requests from this IP, please try again later",
      code: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: {
        message: "Too many requests from this IP, please try again later",
        code: 429,
      },
    });
  },
});

/**
 * Strict rate limiter for auth endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error: {
      message: "Too many authentication attempts, please try again later",
      code: 429,
    },
  },
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, email: ${req.body.email}`);
    res.status(429).json({
      success: false,
      error: {
        message: "Too many authentication attempts, please try again later",
        code: 429,
      },
    });
  },
});

/**
 * Password reset rate limiter
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    success: false,
    error: {
      message: "Too many password reset requests, please try again later",
      code: 429,
    },
  },
});

