import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { errorResponse } from "../types/api-response";

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(errorResponse(parsed.error, "Validation failed"));
    }
    req.body = parsed.data as T;
    next();
  };
