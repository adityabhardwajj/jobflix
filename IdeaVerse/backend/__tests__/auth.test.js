import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";
import Token from "../models/Token.js";

describe("Auth Endpoints", () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up
    await User.deleteMany({});
    await Token.deleteMany({});

    // Create test user
    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "Test123!@#",
      role: "creator",
    });

    // Login to get token
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: "test@example.com", password: "Test123!@#" });
    authToken = loginRes.body.data?.token || loginRes.body.token;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  describe("POST /api/users/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "New User",
          email: "newuser@example.com",
          password: "Password123!@#",
          role: "creator",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("newuser@example.com");
      expect(res.body.data.token).toBeDefined();
    });

    it("should reject invalid email", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "New User",
          email: "invalid-email",
          password: "Password123!@#",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject weak password", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "New User",
          email: "newuser@example.com",
          password: "weak",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/users/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: "test@example.com",
          password: "Test123!@#",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it("should reject invalid credentials", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: "test@example.com",
          password: "WrongPassword123!@#",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/request-password-reset", () => {
    it("should create password reset token", async () => {
      const res = await request(app)
        .post("/api/auth/request-password-reset")
        .send({ email: "test@example.com" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Check token was created
      const tokens = await Token.find({ userId: testUser._id, type: "passwordReset" });
      expect(tokens.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("should reset password with valid token", async () => {
      // Create reset token
      const resetToken = Token.generateToken();
      await Token.create({
        userId: testUser._id,
        token: resetToken,
        type: "passwordReset",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: resetToken,
          newPassword: "NewPassword123!@#",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify password was changed
      const updatedUser = await User.findById(testUser._id);
      const isPasswordValid = await updatedUser.matchPassword("NewPassword123!@#");
      expect(isPasswordValid).toBe(true);
    });

    it("should reject invalid token", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: "invalid-token",
          newPassword: "NewPassword123!@#",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/verify-email", () => {
    it("should verify email with valid token", async () => {
      const verificationToken = Token.generateToken();
      await Token.create({
        userId: testUser._id,
        token: verificationToken,
        type: "emailVerification",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      const res = await request(app).get(
        `/api/auth/verify-email?token=${verificationToken}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify email was marked as verified
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.isEmailVerified).toBe(true);
    });
  });
});

