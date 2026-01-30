import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";

export async function handlerAddUser(req: Request, res: Response) {
    type emailJSON = {
        email: string;
    };
    let email = req.body as emailJSON;

    const user = await createUser(email.email);
    if (!user) {
        throw new Error("Could not create user");
    }
    
    respondWithJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}