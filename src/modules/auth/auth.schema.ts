import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim()
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters")
    .transform((v) => v.normalize("NFKC")),

  email: z
    .email("Invalid email format")
    .trim()
    .transform((v) => v.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Must include at least one special character")
    .trim(),
});

export const LoginSchema = z.object({
  email: z
    .email("Invalid email format")
    .trim()
    .transform((v) => v.toLowerCase()),

  password: z.string().min(1, "Password is required").trim(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
