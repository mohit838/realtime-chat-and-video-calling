import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LoginInput, RegisterInput } from "../../../src/modules/auth/auth.schema";

/* ============================================================
   1. MOCK MODULES — using factories (NO top-level variables!)
============================================================ */
vi.mock("../../../src/modules/auth/auth.repository", () => ({
  authRepository: {
    findByEmail: vi.fn(),
    createUser: vi.fn(),
    getUserRoles: vi.fn(),
    assignDefaultRole: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("../../../src/modules/auth/refresh.service", () => ({
  refreshTokenService: {
    save: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../../src/modules/auth/auth.utils", () => ({
  signToken: vi.fn(),
  generateRefreshToken: vi.fn(),
}));

/* ============================================================
   2. IMPORTS AFTER MOCKS
============================================================ */
import bcrypt from "bcryptjs";
import { authRepository } from "../../../src/modules/auth/auth.repository";
import { AuthService } from "../../../src/modules/auth/auth.service";
import { generateRefreshToken, signToken } from "../../../src/modules/auth/auth.utils";
import { refreshTokenService } from "../../../src/modules/auth/refresh.service";

/* ============================================================
   3. Define REAL UserRow shape (matching your DB schema!)
============================================================ */
interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_active: number;
  otp_verified: number;
  two_factor_enabled: number;
  created_at: Date;
  updated_at: Date;
}

/* ============================================================
   4. TEST SUITE
============================================================ */
describe("AuthService", () => {
  const service = new AuthService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ---------------------------------------------------------
     REGISTER
  --------------------------------------------------------- */
  describe("register()", () => {
    it("registers a new user", async () => {
      const input: RegisterInput = {
        name: "John Doe",
        email: "john@mail.com",
        password: "Password@123",
      };

      (authRepository.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValueOnce("hashedpw");
      (authRepository.createUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce(10);
      (authRepository.assignDefaultRole as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        undefined
      );

      const result = await service.register(input);

      expect(authRepository.findByEmail).toHaveBeenCalledWith("john@mail.com");
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(authRepository.createUser).toHaveBeenCalledWith(
        "John Doe",
        "john@mail.com",
        "hashedpw"
      );
      expect(authRepository.assignDefaultRole).toHaveBeenCalledWith(10);

      expect(result).toEqual({ id: 10 });
    });
  });

  /* ---------------------------------------------------------
     LOGIN
  --------------------------------------------------------- */
  describe("login()", () => {
    it("logs in a user and returns tokens", async () => {
      const input: LoginInput = {
        email: "john@mail.com",
        password: "Password@123",
      };

      const mockUser: UserRow = {
        id: 1,
        name: "John",
        email: "john@mail.com",
        password_hash: "hashedpw",
        is_active: 1,
        otp_verified: 0,
        two_factor_enabled: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (authRepository.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);
      (authRepository.getUserRoles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(["user"]);
      (signToken as ReturnType<typeof vi.fn>).mockResolvedValueOnce("access-token");
      (generateRefreshToken as ReturnType<typeof vi.fn>).mockReturnValueOnce("refresh-token");
      (refreshTokenService.save as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

      const result = await service.login(input);

      expect(authRepository.findByEmail).toHaveBeenCalledWith("john@mail.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("Password@123", "hashedpw");
      expect(authRepository.getUserRoles).toHaveBeenCalledWith(1);
      expect(signToken).toHaveBeenCalled();
      expect(generateRefreshToken).toHaveBeenCalled();
      expect(refreshTokenService.save).toHaveBeenCalled();

      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toBeDefined();
      expect(result.user).toEqual({
        id: 1,
        email: "john@mail.com",
        roles: ["user"],
      });
    });
  });
});
