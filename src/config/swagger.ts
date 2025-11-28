import type { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./env.js";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Realtime Chat API",
    version: "1.0.0",
    description: "API documentation for the Realtime Chat Backend",
  },

  servers: [
    {
      url: "http://localhost:1234",
      description: "Local Development Server",
    },
  ],

  components: {
    // ---------------------------------------
    // SECURITY (JWT)
    // ---------------------------------------
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    // ---------------------------------------
    // GLOBAL SCHEMAS
    // ---------------------------------------
    schemas: {
      // Generic success wrapper
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" },
          data: { type: "object" },
        },
      },

      // Generic error wrapper
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed" },
          error: { type: "object" },
        },
      },

      // -----------------------------------
      // Request Schemas
      // -----------------------------------
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Mohit" },
          email: { type: "string", example: "mohit@example.com" },
          password: { type: "string", example: "StrongPass123!" },
        },
      },

      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "mohit@example.com" },
          password: { type: "string", example: "StrongPass123!" },
        },
      },

      RefreshRequest: {
        type: "object",
        required: ["userId", "refreshToken"],
        properties: {
          userId: { type: "number", example: 1 },
          refreshToken: {
            type: "string",
            example: "1234567890abcdef-refresh",
          },
        },
      },

      // -----------------------------------
      // Response Schemas
      // -----------------------------------
      AuthTokens: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          refreshToken: {
            type: "string",
            example: "new-refresh-token-value",
          },
        },
      },

      UserProfile: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          email: { type: "string", example: "mohit@example.com" },
          roles: {
            type: "array",
            items: { type: "string" },
            example: ["admin", "moderator"],
          },
        },
      },
    },
  },

  // ---------------------------------------
  // API PATH DEFINITIONS
  // ---------------------------------------
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
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
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/AuthTokens" },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { description: "Invalid credentials" },
        },
      },
    },

    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh the access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Token refreshed",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/AuthTokens" },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { description: "Invalid refresh token" },
        },
      },
    },

    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout the user",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "User logged out" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get logged-in user's profile",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "User profile details",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/UserProfile" },
                      },
                    },
                  ],
                },
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
  // Hide Swagger in production automatically
  if (env.APP_ENV === "production") {
    return;
  }

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
