import argon2 from "argon2";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { config } from "./config.js";

import { UserNotAuthenticatedError, BadRequestError, UserForbiddenError } from "./api/errors.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    if (!password) return false;
    try {
        return await argon2.verify(hash, password);
    } catch {
        return false;
    }
}

export function makeJWT(userId: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expiresIn;
    
    const tokenPayload: payload = {
        iss: "chirpy",
        sub: userId,
        iat: iat,
        exp: exp,
    };

    return jwt.sign(tokenPayload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: payload;
    try {
        decoded = jwt.verify(tokenString, secret) as payload;
    } catch (err) {
        throw new UserNotAuthenticatedError("Unauthorized: Invalid or expired token");
    }  
    if (decoded.iss !== "chirpy") {
        throw new UserNotAuthenticatedError("Invalid token payload: missing subject");
    }

    if (!decoded.sub) {
        throw new UserNotAuthenticatedError("No user ID in token");
    }
    return decoded.sub;
}


export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");

    if(!authHeader) {
        throw new UserNotAuthenticatedError("Malformed auth header");
    }

    return extractToken(authHeader);
}

export function extractToken(header: string) {
    const parts = header.split(/\s+/);
    if (parts.length < 2 || parts[0] !== "Bearer") {
        throw new BadRequestError("Invalid authorization header format. Expected 'Bearer <token>'")
    }
    return parts[1];
}

export function makeRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function getAPIKey(req: Request) {
    const auth = req.get("Authorization");
    if(!auth) {
        return false;
    }

    const apikey = auth.split(" ")[1];
    if (apikey !== config.polka.apikey) {
        return false;
    }
    return true;
}