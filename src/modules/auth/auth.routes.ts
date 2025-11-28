import { Router } from "express";
import { roleGuard } from "../../middlewares/role-guard.js";
import { validate } from "../../middlewares/validate.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { authController } from "./auth.controller.js";
import { authGuard } from "./auth.middleware.js";
import { LoginSchema, RefreshSchema, RegisterSchema } from "./auth.schema.js";

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterSchema"
 *     responses:
 *       201: { description: User registered }
 *       400: { description: Validation error }
 */
router.post("/register", validate(RegisterSchema), catchAsync(authController.register));

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginSchema"
 *     responses:
 *       200: { description: Login success }
 */
router.post("/login", validate(LoginSchema), catchAsync(authController.login));

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RefreshSchema"
 *     responses:
 *       200: { description: Token refreshed }
 */
router.post("/refresh", validate(RefreshSchema), catchAsync(authController.refresh));

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: Logged out }
 */
router.post("/logout", authGuard, catchAsync(authController.logout));

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 */
router.get("/me", authGuard, catchAsync(authController.me));

/**
 * @openapi
 * /api/auth/admin-only:
 *   get:
 *     summary: Admin route
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 */
router.get(
  "/admin-only",
  authGuard,
  roleGuard("admin"),
  catchAsync(async (_, res) => res.json({ ok: true, message: "Admin content" }))
);

/**
 * @openapi
 * /api/auth/mod-or-admin:
 *   get:
 *     summary: Moderator or Admin route
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 */
router.get(
  "/mod-or-admin",
  authGuard,
  roleGuard("moderator", "admin"),
  catchAsync(async (_, res) => res.json({ ok: true, message: "Moderator or Admin content" }))
);

export default router;
