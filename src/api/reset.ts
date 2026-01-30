import { application, Request, Response } from "express";
import { config } from "../config.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { UserForbiddenError } from "./errors.js";
import { deleteUsers } from "../db/queries/users.js";

// export async function handlerReset(_: Request, res: Response) {
//     config.api.fileserverHits = 0;

//     res
//         .set("Content-Type", "text/plain; charset=utf-8")
//         .send("Reset Successful.")
// }

export async function handlerReset(_: Request, res: Response) {
    if (config.api.platform !== "dev") {
        throw new UserForbiddenError("Was not dev - reset only allowed in dev env",);
    }
    config.api.fileserverHits = 0;
    await deleteUsers();
    respondWithJSON(res, 200, {body: "good"});
}