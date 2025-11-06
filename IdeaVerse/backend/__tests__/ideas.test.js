import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";
import Idea from "../models/Idea.js";

describe("Ideas Endpoints", () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Idea.deleteMany({});

    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "Test123!@#",
      role: "creator",
    });

    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: "test@example.com", password: "Test123!@#" });
    authToken = loginRes.body.data?.token || loginRes.body.token;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Idea.deleteMany({});
  });

  describe("POST /api/ideas", () => {
    it("should create a new idea", async () => {
      const res = await request(app)
        .post("/api/ideas")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test Idea",
          description: "This is a test idea description with enough characters to pass validation",
          tags: ["test", "idea"],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Test Idea");
    });

    it("should reject idea without title", async () => {
      const res = await request(app)
        .post("/api/ideas")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          description: "This is a test idea description",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/ideas", () => {
    beforeEach(async () => {
      // Create test ideas
      await Idea.create([
        {
          title: "Idea 1",
          description: "Description for idea 1 with enough characters",
          createdBy: testUser._id,
          tags: ["tag1"],
        },
        {
          title: "Idea 2",
          description: "Description for idea 2 with enough characters",
          createdBy: testUser._id,
          tags: ["tag2"],
        },
      ]);
    });

    it("should get all ideas", async () => {
      const res = await request(app).get("/api/ideas");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it("should paginate ideas", async () => {
      const res = await request(app).get("/api/ideas?page=1&limit=1");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.totalPages).toBeGreaterThanOrEqual(2);
    });

    it("should search ideas", async () => {
      const res = await request(app).get("/api/ideas?search=Idea 1");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("PUT /api/ideas/:id", () => {
    let ideaId;

    beforeEach(async () => {
      const idea = await Idea.create({
        title: "Original Title",
        description: "Original description with enough characters to pass validation",
        createdBy: testUser._id,
      });
      ideaId = idea._id;
    });

    it("should update idea", async () => {
      const res = await request(app)
        .put(`/api/ideas/${ideaId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Updated Title",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Updated Title");
    });

    it("should reject update from non-owner", async () => {
      const otherUser = await User.create({
        name: "Other User",
        email: "other@example.com",
        password: "Test123!@#",
        role: "creator",
      });

      const loginRes = await request(app)
        .post("/api/users/login")
        .send({ email: "other@example.com", password: "Test123!@#" });
      const otherToken = loginRes.body.data?.token || loginRes.body.token;

      const res = await request(app)
        .put(`/api/ideas/${ideaId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({
          title: "Updated Title",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("DELETE /api/ideas/:id", () => {
    let ideaId;

    beforeEach(async () => {
      const idea = await Idea.create({
        title: "To Delete",
        description: "This idea will be deleted with enough characters",
        createdBy: testUser._id,
      });
      ideaId = idea._id;
    });

    it("should delete idea", async () => {
      const res = await request(app)
        .delete(`/api/ideas/${ideaId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify idea was deleted
      const deletedIdea = await Idea.findById(ideaId);
      expect(deletedIdea).toBeNull();
    });
  });
});

