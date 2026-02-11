import { getUserByEmail } from "../db/queries/users.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, makeJWT } from "../auth.js"
import { respondWithJSON } from "./json.js";


import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";
import { config } from "../config.js";

type LoginResponse = UserResponse & {
    token: string;
};

export async function handlerLogin(req: Request, res: Response) {
    type UserPayload = {
        email: string;
        password: string;
        expiresIn?: number;
    };

    const params: UserPayload = req.body;

    const user = await getUserByEmail(params.email);
    if(!user) {
        throw new UserNotAuthenticatedError("incorrect email or password");
    }

    const passwordMatch = await checkPasswordHash(params.password, user.hashedPassword)
    if (!passwordMatch) {
        throw new UserNotAuthenticatedError("incorrect email or password")
    }

    let duration = config.jwt.defaultDuration;
    if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
        duration = params.expiresIn;
    }

    const token = makeJWT(user.id, duration, config.jwt.secret)
    
    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token,
    } satisfies LoginResponse);
}

