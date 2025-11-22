import type { Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import { authService } from "./auth.service";

export class AuthController {
  private handleError(res: Response, error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(400).json({ error: message });
  }

  async register(req: Request, res: Response) {
    const parsed = RegisterSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error,
      });
    }

    try {
      const result = await authService.register(parsed.data);
      return res.status(201).json({
        message: "Registered successfully",
        userId: result.id,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async login(req: Request, res: Response) {
    const parsed = LoginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error,
      });
    }

    try {
      const result = await authService.login(parsed.data);
      return res.json(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export const authController = new AuthController();
