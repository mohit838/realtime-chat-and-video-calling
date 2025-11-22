import { Router } from "express";
import { authController } from "./auth.controller";
import { authGuard } from "./auth.middleware";

const router = Router();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.get("/me", authGuard, () => {});

export default router;
