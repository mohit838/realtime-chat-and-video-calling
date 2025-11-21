import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/server";

describe("GET /", () => {
  it("should return ok", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("ok");
  });
});
