import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authController } from "./auth.controller";
import { authGuard } from "./auth.middleware";

const router = Router();

router.post("/register", catchAsync(authController.register));
router.post("/login", catchAsync(authController.login));
router.get("/me", authGuard, catchAsync(authController.me));

export default router;
