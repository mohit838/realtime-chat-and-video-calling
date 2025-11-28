import type { Application } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Realtime Chat API",
    version: "1.0.0",
    description: "API documentation for Realtime Chat Backend",
  },

  servers: [
    {
      url: "http://localhost:1234",
      description: "Local Dev Server",
    },
  ],

  // -------------------------
  // GLOBAL SECURITY
  // -------------------------
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      RegisterRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Mohit" },
          email: { type: "string", example: "mohit@example.com" },
          password: { type: "string", example: "StrongPass123!" },
        },
        required: ["name", "email", "password"],
      },

      LoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", example: "mohit@example.com" },
          password: { type: "string", example: "StrongPass123!" },
        },
        required: ["email", "password"],
      },

      AuthTokens: {
        type: "object",
        properties: {
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
        },
      },

      UserProfile: {
        type: "object",
        properties: {
          id: { type: "number" },
          email: { type: "string" },
          roles: { type: "array", items: { type: "string" } },
        },
      },
    },
  },

  // -------------------------
  // API PATHS
  // -------------------------
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error" },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Logged in successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthTokens" },
              },
            },
          },
          400: { description: "Validation error or wrong credentials" },
        },
      },
    },

    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "number", example: 1 },
                  refreshToken: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "New access token issued" },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    },

    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Logged out successfully" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get logged-in user profile",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "User profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserProfile" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
  },
};

export function setupSwagger(app: Application) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
