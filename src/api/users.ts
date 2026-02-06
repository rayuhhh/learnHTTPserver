import type { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { respondWithJSON, respondWithError } from "./json.js";
import { hashPassword, checkPasswordHash } from "../auth.js";
import { NewUser } from "../db/schema.js";

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
    } satisfies UserResponse);
}



