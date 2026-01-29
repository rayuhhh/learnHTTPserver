import type { Response } from "express";

export function respondWithError( res: Response, statusCode: number, msg:string) {
    respondWithJSON(res, statusCode, { error: msg });
} 

export function respondWithJSON(res: Response, statusCode: number, payload: any) {
    res.header("Content-Type", "application/json");
    const body = JSON.stringify(payload);
    res.status(statusCode).send(body);
}