import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .trim()
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters")
    .transform((v) => v.normalize("NFKC")),

  email: z
    .email()
    .trim()
    .transform((v) => v.toLowerCase()),

  password: z
    .string()
    .min(8)
    .max(32)
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Must include at least one special character")
    .trim(),
});

export const LoginSchema = z.object({
  email: z
    .email()
    .trim()
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1),
});

export const RefreshSchema = z.object({
  userId: z.number(),
  refreshToken: z.string().min(10),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshInput = z.infer<typeof RefreshSchema>;
