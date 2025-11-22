import type { Request, Response } from "express";
import { successResponse } from "../../types/api-response";
import { logInfo, logWarn } from "../../utils/log";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import { authService } from "./auth.service";

export class AuthController {
  register = async (req: Request, res: Response) => {
    logInfo("Register endpoint hit", {
      requestId: req.requestId,
      path: req.originalUrl,
      method: req.method,
    });

    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      logWarn("Register validation failed", {
        requestId: req.requestId,
        path: req.originalUrl,
        errors: parsed.error,
      });
      throw parsed.error;
    }

    const result = await authService.register(parsed.data);

    logInfo("User registered successfully", {
      requestId: req.requestId,
      userId: result.id,
    });

    return res.status(201).json(successResponse(result, "Registered successfully"));
  };

  login = async (req: Request, res: Response) => {
    logInfo("Login endpoint hit", {
      requestId: req.requestId,
      path: req.originalUrl,
      method: req.method,
    });

    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      logWarn("Login validation failed", {
        requestId: req.requestId,
        path: req.originalUrl,
        errors: parsed.error,
      });
      throw parsed.error;
    }

    const result = await authService.login(parsed.data);

    logInfo("User logged in", {
      requestId: req.requestId,
      email: parsed.data.email,
    });

    return res.json(successResponse(result, "Logged in successfully"));
  };

  me = async (req: Request, res: Response) => {
    logInfo("Profile request (me) endpoint hit", {
      requestId: req.requestId,
      userId: req.user?.id,
      path: req.originalUrl,
    });

    return res.json(successResponse(req.user, "Profile fetched"));
  };
}

export const authController = new AuthController();
