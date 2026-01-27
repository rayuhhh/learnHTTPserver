import { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerReset(_: Request, res: Response) {
    config.fileserverHits = 0;

    res
        .set("Content-Type", "text/plain; charset=utf-8")
        .send("Reset Successful.")
}