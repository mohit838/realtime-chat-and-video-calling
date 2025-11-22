import bcrypt from "bcryptjs";
import { authRepository } from "./auth.repository";
import type { LoginInput, RegisterInput } from "./auth.schema";
import { signToken } from "./auth.utils";

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = await authRepository.createUser(data.name, data.email, hashedPassword);

    await authRepository.assignDefaultRole(userId);

    return { id: userId };
  }

  async login(data: LoginInput) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = signToken({
      id: user.id,
      email: user.email,
    });

    return { token };
  }
}

export const authService = new AuthService();
