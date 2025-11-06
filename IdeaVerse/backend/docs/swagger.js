import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IdeaVerse API",
      version: "1.0.0",
      description: "API documentation for IdeaVerse - Innovation and Freelance Collaboration Platform",
      contact: {
        name: "IdeaVerse Support",
        email: "support@ideaverse.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["creator", "freelancer", "recruiter", "admin"] },
            isEmailVerified: { type: "boolean" },
            headline: { type: "string" },
            bio: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
          },
        },
        Idea: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            createdBy: { $ref: "#/components/schemas/User" },
            likes: { type: "array", items: { type: "string" } },
            comments: { type: "array" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Job: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            budgetRange: { type: "string" },
            isRemote: { type: "boolean" },
            location: { type: "string" },
            status: { type: "string", enum: ["open", "closed", "paused"] },
            postedBy: { $ref: "#/components/schemas/User" },
            applications: { type: "array" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                message: { type: "string" },
                code: { type: "integer" },
                details: { type: "array" },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(options);

export default (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "IdeaVerse API Documentation",
  }));
};

