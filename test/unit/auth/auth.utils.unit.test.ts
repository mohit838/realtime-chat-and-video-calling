import { describe, expect, it, vi } from "vitest";

// --- MOCK JOSE ---
vi.mock("jose", () => {
  return {
    SignJWT: class {
      constructor() {}
      setProtectedHeader = vi.fn().mockReturnThis();
      setExpirationTime = vi.fn().mockReturnThis();
      sign = vi.fn().mockResolvedValue("mocked-jwt-token");
    },
    jwtVerify: vi.fn().mockResolvedValue({
      payload: { id: 1, email: "john@mail.com", roles: ["user"] },
    }),
  };
});

// Import after mock
import { signToken, verifyToken } from "../../../src/modules/auth/auth.utils";

describe("Auth Utils", () => {
  it("signToken() returns a JWT string", async () => {
    const jwt = await signToken({
      id: 1,
      email: "john@mail.com",
      roles: ["user"],
    });

    expect(jwt).toBe("mocked-jwt-token");
  });

  it("verifyToken() returns decoded payload", async () => {
    const payload = await verifyToken("abc123");

    expect(payload).toEqual({
      id: 1,
      email: "john@mail.com",
      roles: ["user"],
    });
  });
});
