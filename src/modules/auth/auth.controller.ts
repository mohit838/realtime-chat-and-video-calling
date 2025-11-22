import type { Request, Response } from "express";
import { successResponse } from "../../types/api-response";
import { authRepository } from "./auth.repository";
import { LoginSchema, RefreshSchema, RegisterSchema } from "./auth.schema";
import { authService } from "./auth.service";
import { generateRefreshToken, signToken } from "./auth.utils";
import { refreshTokenService } from "./refresh.service";

export class AuthController {
  register = async (req: Request, res: Response) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) throw parsed.error;

    const result = await authService.register(parsed.data);
    return res.status(201).json(successResponse(result, "Registered"));
  };

  login = async (req: Request, res: Response) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) throw parsed.error;

    const result = await authService.login(parsed.data);

    return res.json(successResponse(result, "Logged in"));
  };

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

  logout = async (req: Request, res: Response) => {
    await refreshTokenService.delete(req.user!.id);
    return res.json(successResponse(null, "Logged out"));
  };

  me = async (req: Request, res: Response) => {
    return res.json(successResponse(req.user, "Profile fetched"));
  };
}

export const authController = new AuthController();
