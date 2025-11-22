import { Router } from "express";
import { roleGuard } from "../../middlewares/role-guard";
import { catchAsync } from "../../utils/catchAsync";
import { authController } from "./auth.controller";
import { authGuard } from "./auth.middleware";

const router = Router();

// Auth Related routes
router.post("/register", catchAsync(authController.register));
router.post("/login", catchAsync(authController.login));
router.post("/refresh", catchAsync(authController.refresh));
router.post("/logout", authGuard, catchAsync(authController.logout));

// Protected routes
router.get("/me", authGuard, catchAsync(authController.me));
router.get(
  "/admin-only",
  authGuard,
  roleGuard("admin"),
  catchAsync(async (req, res) => {
    res.json({ ok: true, message: "Admin content" });
  })
);
router.get(
  "/mod-or-admin",
  authGuard,
  roleGuard("moderator", "admin"),
  catchAsync(async (req, res) => {
    res.json({ ok: true, message: "Moderator or Admin content" });
  })
);

export default router;
