import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authGuard } from "../../../src/modules/auth/auth.middleware.js";
import * as utils from "../../../src/modules/auth/auth.utils.js";

// ------------------------------
// Patch Request type ONLY for tests
// ------------------------------
interface TestRequest extends Partial<Request> {
  headers: Record<string, string>;
  originalUrl: string;
  method: string;
  requestId: string;
  user?: {
    id: number;
    email: string;
    roles: string[];
  };
}

// ------------------------------
// Mock Request Creator
// ------------------------------
function createMockReq(token?: string): TestRequest {
  return {
    headers: token ? { authorization: `Bearer ${token}` } : {},
    originalUrl: "/test",
    method: "GET",
    requestId: "req-123",
  };
}

// ------------------------------
// Mock Response Creator
// ------------------------------
function createMockRes() {
  const json = vi.fn();
  const status = vi.fn((_code: number) => {
    void _code;
    return { json };
  });

  return {
    status,
    json,
  } as unknown as Response;
}

// ------------------------------
// Tests
// ------------------------------
describe("authGuard Middleware", () => {
  const verifyMock = vi.spyOn(utils, "verifyToken");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ------------------------------
  // Missing token
  // ------------------------------
  it("returns 401 if no Bearer token", async () => {
    const req = createMockReq();
    const res = createMockRes();
    const next = vi.fn();

    await authGuard(req as Request, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // ------------------------------
  // Invalid token
  // ------------------------------
  it("returns 401 if token invalid", async () => {
    const req = createMockReq("invalidtoken");
    const res = createMockRes();
    const next = vi.fn();

    verifyMock.mockRejectedValue(new Error("Invalid token"));

    await authGuard(req as Request, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // ------------------------------
  // Valid token
  // ------------------------------
  it("sets req.user and calls next()", async () => {
    const req = createMockReq("validtoken");
    const res = createMockRes();
    const next = vi.fn();

    verifyMock.mockResolvedValue({
      id: 1,
      email: "john@mail.com",
      roles: ["user"],
    });

    await authGuard(req as unknown as Request, res, next as NextFunction);

    expect(req.user).toEqual({
      id: 1,
      email: "john@mail.com",
      roles: ["user"],
    });

    expect(next).toHaveBeenCalled();
  });
});
