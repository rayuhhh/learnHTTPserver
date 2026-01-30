import type { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

import { BadRequestError } from "./errors.js";

export async function handlerValidate(req: Request, res: Response) {
    type param = {
        body: string;
    };
    const badWords = ["kerfuffle", "sharbert", "fornax"];

    const params = req.body as param;
    
    const maxChirpLen = 140;

    // if(!params.body) {
    //     return respondWithError(res, 400, "Something went wrong");
    // }

    if (params.body.length > maxChirpLen) {
        // return respondWithError(res, 400, "Chirp is too long. Max length is 140");
        //throw new Error("Chirp is too long");
        throw new BadRequestError(
            `Chirp is too long. Max length is ${maxChirpLen}`,
        );
    }

    let payload = {cleanedBody: params.body};
    for (const word of badWords) {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        payload.cleanedBody = payload.cleanedBody.replaceAll(regex, "****");
    }
    respondWithJSON(res, 200, payload);
    
    // let bodybuffer = "";

    // req.on("data", (chunk) => {
    //     bodybuffer += chunk.toString();
    // });

    // let params:param;
    // req.on("end", () => {
    //     try {
    //         params = JSON.parse(bodybuffer);
            
    //     } catch (err) {
    //         respondWithError(res, 400, "Something went wrong");
    //     }

    //     const maxChirpLen = 140;
    //     if(params.body.length > maxChirpLen) {
    //         respondWithError(res, 400, "Chirp is too long");
    //         return;
    //     }
    //     respondWithJSON(res, 200, { valid: true });
    // });
}