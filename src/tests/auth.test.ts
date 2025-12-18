import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "../auth";

describe("JWT Authentication", () => {
  const userID = "user-123";
  const secret = "super-secret-key";
  const wrongSecret = "wrong-secret-key";

  let validToken: string;
  let expiredToken: string;

  beforeAll(() => {
    validToken = makeJWT(userID, secret);
    expiredToken = makeJWT(userID, secret);
  });

  it("should create and validate a valid JWT", () => {
    const result = validateJWT(validToken, secret);
    expect(result).toBe(userID);
  });

  it("should reject an expired JWT", () => {
    expect(() => {
      validateJWT(expiredToken, secret);
    }).toThrow();
  });

  it("should reject a JWT signed with the wrong secret", () => {
    expect(() => {
      validateJWT(validToken, wrongSecret);
    }).toThrow();
  });
});
