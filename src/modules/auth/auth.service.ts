import bcrypt from "bcryptjs";
import { authRepository } from "./auth.repository";
import type { LoginInput, RegisterInput } from "./auth.schema";
import { generateRefreshToken, signToken } from "./auth.utils";
import { refreshTokenService } from "./refresh.service";

export class AuthService {
  // 1. Register
  async register(data: RegisterInput) {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) throw new Error("Email already exists");

    const hash = await bcrypt.hash(data.password, 10);
    const userId = await authRepository.createUser(data.name, data.email, hash);

    await authRepository.assignDefaultRole(userId);

    return { id: userId };
  }

  // 2. Login
  async login(data: LoginInput) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(data.password, user.password_hash);
    if (!match) throw new Error("Invalid email or password");

    const roles = await authRepository.getUserRoles(user.id);

    const accessToken = await signToken({ id: user.id, email: user.email, roles });
    const refreshToken = generateRefreshToken();

    await refreshTokenService.save(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, roles },
    };
  }
}

export const authService = new AuthService();
