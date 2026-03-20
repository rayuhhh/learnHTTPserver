import type { Request, Response } from "express";
import { createUser, getUserByEmail, updateEmailPw, upgradeRed } from "../db/queries/users.js";
import { respondWithJSON, respondWithError } from "./json.js";
import { hashPassword, checkPasswordHash, getBearerToken, validateJWT, getAPIKey } from "../auth.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";
import { param } from "drizzle-orm";
import { BadRequestError } from "./errors.js";
//import { config } from "process";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerAddUser(req: Request, res: Response) {
    type UserPayload = { // emailJson
        password: string;
        email: string;
    };
    
    const params: UserPayload = req.body;

    if( !params.email || !params.password ) {
        return respondWithError(res, 400, "Email and password are required");
    }
    
    const hashedPassword = await hashPassword(params.password);

    const user = await createUser(params.email, hashedPassword);

    if (!user) {
        throw new Error("Could not create user");
    }

    respondWithJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed,
    } satisfies UserResponse);
}

export async function handlerUpdateEmailPw(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };
    const token = getBearerToken(req);
    const subject = validateJWT(token, config.jwt.secret);

    const params: parameters = req.body;

    if (!params.password || !params.email) {
        throw new BadRequestError("Missing required fields");
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await updateEmailPw(subject, params.email, hashedPassword); //

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
    } satisfies UserResponse);
}

export async function handlerUpgradeRed(req: Request, res: Response) {
    type parameters = {
        event: string,
        data: {
            userId: string, 
        },
    };
    const apikey = getAPIKey(req);
    if (!apikey) {
        return res.status(401).send();
    }
    const params: parameters = req.body;
    if (params.event && params.event !== "user.upgraded") {
        return res.status(204).send();
    }
    if (params.event === "user.upgraded") {
        
        const user = await upgradeRed(params.data.userId);
        if (!user) {
            return respondWithError(res, 400, `User ${params.data.userId} not found`);
        }
        
        return res.status(204).send();
    }
}



