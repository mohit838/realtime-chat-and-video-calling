import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authController } from "./auth.controller";
import { authGuard } from "./auth.middleware";

const router = Router();

router.post("/register", catchAsync(authController.register));
router.post("/login", catchAsync(authController.login));
router.post("/refresh", catchAsync(authController.refresh));
router.post("/logout", authGuard, catchAsync(authController.logout));
router.get("/me", authGuard, catchAsync(authController.me));

export default router;
