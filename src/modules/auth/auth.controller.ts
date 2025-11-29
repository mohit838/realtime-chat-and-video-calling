import type { Request, Response } from "express";
import { successResponse } from "../../types/api-response.js";
import { authRepository } from "./auth.repository.js";
import { authService } from "./auth.service.js";
import { generateRefreshToken, signToken } from "./auth.utils.js";
import { refreshTokenService } from "./refresh.service.js";

export class AuthController {
  // Register
  register = async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return res.status(201).json(successResponse(result, "Registered"));
  };

  // Login
  login = async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    return res.status(200).json(successResponse(result, "Logged in"));
  };

  // Refresh
  refresh = async (req: Request, res: Response) => {
    const { userId, refreshToken } = req.body;

    const storedToken = await refreshTokenService.get(userId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new Error("Invalid token");
    }

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

  // Logout
  logout = async (req: Request, res: Response) => {
    await refreshTokenService.delete(req.user!.id);
    return res.status(200).json(successResponse(null, "Logged out"));
  };

  // Get profile
  me = async (req: Request, res: Response) => {
    return res.status(200).json(successResponse(req.user, "Profile fetched"));
  };
}

export const authController = new AuthController();
