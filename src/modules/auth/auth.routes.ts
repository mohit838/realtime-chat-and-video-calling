import { Router, type Router as RouterType } from "express";
import { roleGuard } from "../../middlewares/role-guard.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { authController } from "./auth.controller.js";
import { authGuard } from "./auth.middleware.js";

const router: RouterType = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: User registered successfully }
 *       400: { description: Validation error }
 */
router.post("/register", catchAsync(authController.register));

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Logged in successfully }
 */
router.post("/login", catchAsync(authController.login));

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: number }
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Token refreshed }
 *       401: { description: Invalid refresh token }
 */
router.post("/refresh", catchAsync(authController.refresh));

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: Logged out successfully }
 *       401: { description: Unauthorized }
 */
router.post("/logout", authGuard, catchAsync(authController.logout));

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: User profile fetched }
 *       401: { description: Unauthorized }
 */
router.get("/me", authGuard, catchAsync(authController.me));

/**
 * @openapi
 * /api/auth/admin-only:
 *   get:
 *     summary: Admin-only protected route
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: Admin content" }
 *       403: { description: Forbidden - requires admin role }
 */
router.get(
  "/admin-only",
  authGuard,
  roleGuard("admin"),
  catchAsync(async (_req, res) => {
    res.json({ ok: true, message: "Admin content" });
  })
);

/**
 * @openapi
 * /api/auth/mod-or-admin:
 *   get:
 *     summary: Moderator or Admin route
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: Moderator or Admin content }
 *       403: { description: Forbidden - requires mod/admin }
 */
router.get(
  "/mod-or-admin",
  authGuard,
  roleGuard("moderator", "admin"),
  catchAsync(async (_req, res) => {
    res.json({ ok: true, message: "Moderator or Admin content" });
  })
);

export default router;
