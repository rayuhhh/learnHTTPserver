import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, extractToken } from "./auth";
import { UserNotAuthenticatedError, BadRequestError } from "./api/errors";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for an incorrect password", async () => {
    const result = await checkPasswordHash("wrongPassword", hash1);
    expect(result).toBe(false);
  });

  it("should return false when password doesn't match a different hash", async() => {
    const reuslt = await checkPasswordHash(password1, hash2);
    expect(reuslt).toBe(false);
  });

  it("should return false for an empty password", async () => {
    const result = await checkPasswordHash("", hash1);
    expect(result).toBe(false);
  });

  it("should return false for an invalid hash", async () => {
    const result = await checkPasswordHash(password1, "invalidhash");
    expect(result).toBe(false);
  });
});

// ########################################

describe("JWT Functions", () => {
  const secret = "secret";
  const wrongSecret = "wrong_secret";
  const userId = "some-unique-user-id";
  let validToken: string;

  beforeAll(() => {
    validToken = makeJWT(userId, 3600, secret);
  });

  it("should validate a valid token", () => {
    const result = validateJWT(validToken, secret);
    expect(result).toBe(userId);
  });

  it("Should validate a valid token", () => {
    const result = validateJWT(validToken, secret);
    expect(result).toBe(userId);
  });

  it("should throw an error for an invalid token string", () => {
    expect(() => validateJWT("invalid.token.string", secret)).toThrow(UserNotAuthenticatedError,);
  });

  it("should throw an error when the token is signed with a wrong secret", () => {
    expect(()=> validateJWT(validToken, wrongSecret)).toThrow(UserNotAuthenticatedError,);
  });
});

// #####################################

describe("extractToken", () => {
  it("Should extract the token from a valid header", () => {
    const token = "mySecretToken";
    const header = `Bearer ${token}`;
    expect(extractToken(header)).toBe(token);
  });

  it("Should extract the token even if there are extra parts", () => {
    const token = "mySecretToken";
    const header = `Bearer ${token} extras`;
    expect(extractToken(header)).toBe(token);
  });

  it("should throw a BadRequestError if header does not contain at least 2 parts", () => {
    const header = "Bearer";
    expect(() => extractToken(header)).toThrow(BadRequestError);
  });

  it("Should throw a BadRequestError if header does not start with 'Bearer'", () => {
    const header = "Giraffe mySecretToken";
    expect(() => extractToken(header)).toThrow(BadRequestError);
  });

  it("Should throw a BadRequestError if header is empty string", () => {
    const header = "";
    expect(() => extractToken(header)).toThrow(BadRequestError);
  });
});