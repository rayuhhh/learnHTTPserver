import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";

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
    try {
        const decoded = jwt.verify(tokenString, secret) as payload;

        if (!decoded.sub) {
            throw new Error("Invalid token payload: missing subject");
        }

        return decoded.sub;
    } catch (err) {
        throw new Error("Unauthorized: Invalid or expired token");
    }
}