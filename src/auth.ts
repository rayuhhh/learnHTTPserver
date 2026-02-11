import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

import { UserNotAuthenticatedError, BadRequestError } from "./api/errors.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
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
        throw new BadRequestError("Authorization header is missing");
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