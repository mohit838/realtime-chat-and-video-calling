import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2).trim().normalize(),
  email: z.email().trim().normalize(),
  password: z.string().min(6).trim(),
});

export const LoginSchema = z.object({
  email: z.email().trim().normalize(),
  password: z.string().min(6).trim(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
