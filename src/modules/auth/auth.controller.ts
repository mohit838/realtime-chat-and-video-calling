import type { Request, Response } from "express";
import { successResponse } from "../../types/api-response.js";
import { authRepository } from "./auth.repository.js";
import { LoginSchema, RefreshSchema, RegisterSchema } from "./auth.schema.js";
import { authService } from "./auth.service.js";
import { generateRefreshToken, signToken } from "./auth.utils.js";
import { refreshTokenService } from "./refresh.service.js";

export class AuthController {
  // 1. Register
  register = async (req: Request, res: Response) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) throw parsed.error;

    const result = await authService.register(parsed.data);
    return res.status(201).json(successResponse(result, "Registered"));
  };

  // 2. Login
  login = async (req: Request, res: Response) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) throw parsed.error;

    const result = await authService.login(parsed.data);

    return res.json(successResponse(result, "Logged in"));
  };

  // 3. Token Refresh
  refresh = async (req: Request, res: Response) => {
    const parsed = RefreshSchema.safeParse(req.body);
    if (!parsed.success) throw parsed.error;

    const { userId, refreshToken } = parsed.data;

    const stored = await refreshTokenService.get(userId);
    if (!stored || stored !== refreshToken) throw new Error("Invalid token");

    const user = await authRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const roles = await authRepository.getUserRoles(userId);

    const newRefreshToken = generateRefreshToken();
    await refreshTokenService.save(userId, newRefreshToken);

    const accessToken = await signToken({
      id: user.id,
      email: user.email,
      roles,
    });

    return res.json(
      successResponse({ accessToken, refreshToken: newRefreshToken }, "Token refreshed")
    );
  };

  // 4. Logout
  logout = async (req: Request, res: Response) => {
    await refreshTokenService.delete(req.user!.id);
    return res.json(successResponse(null, "Logged out"));
  };

  // 5. Get Profile
  me = async (req: Request, res: Response) => {
    return res.json(successResponse(req.user, "Profile fetched"));
  };
}

export const authController = new AuthController();
