import { getUserByEmail } from "../db/queries/users";
import { UserNotAuthenticatedError } from "./errors";
import { checkPasswordHash } from "../auth.js"
import { respondWithJSON } from "./json.js";

import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";

export async function handlerLogin(req: Request, res: Response) {
    type UserPayload = {
        email: string;
        password: string;
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
    
    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
    } satisfies UserResponse);
}