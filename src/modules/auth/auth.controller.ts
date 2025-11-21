import type { Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import { authService } from "./auth.service";

export class AuthController {
  async register(req: Request, res: Response) {
    console.debug(req);

    const parse = RegisterSchema.safeParse(req.body);

    console.debug(parse);

    if (!parse.success) {
      return res.status(400).json({ errors: parse.error.flatten() });
    }

    try {
      const result = await authService.register(parse.data);
      return res.json({ message: "Registered successfully", userId: result.id });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return res.status(400).json({ error: message });
    }
  }

  async login(req: Request, res: Response) {
    const parse = LoginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ errors: parse.error.flatten() });
    }

    try {
      const result = await authService.login(parse.data);
      return res.json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return res.status(400).json({ error: message });
    }
  }
}

export const authController = new AuthController();
