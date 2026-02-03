import type { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

import { BadRequestError, NotFoundError } from "./errors.js";
import { addChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
    type param = {
        body: string;
        userId: string;
    };

    const params: param = req.body;
    const cleaned = validateChirp(params.body);
    const chirp = await addChirp({body: cleaned, userId: params.userId});

    respondWithJSON(res, 201, chirp);


    // if(!params.body) {
    //     return respondWithError(res, 400, "Something went wrong");
    // }

    // if (params.body.length > maxChirpLen) {
    //     // return respondWithError(res, 400, "Chirp is too long. Max length is 140");
    //     //throw new Error("Chirp is too long");
    //     throw new BadRequestError(
    //         `Chirp is too long. Max length is ${maxChirpLen}`,
    //     );
    // }

    // const chirp = await addChirp({body:payload.cleanedBody, userId: params.userId})
    // console.log("hello");
    // respondWithJSON(res, 201, chirp);
    
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

function getCleanedBody(body: string, badWords: string[]) {
    for (const word of badWords) {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        body = body.replaceAll(regex, "****");
    }

    return body;
}

function validateChirp(body: string) {
    const maxChirpLen = 140;
    if (body.length > maxChirpLen) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLen}`);
    }
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    return getCleanedBody(body, badWords);
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    const chirps = await getAllChirps();
    res.status(200).json(chirps)
}

export async function handlerGetChirp(req: Request, res: Response) {
    const { chirpId } =  req.params;
    
    if (!chirpId) {
        return respondWithError(res, 404, `${chirpId}`)
    }

    const chirp = await getChirp(chirpId as string);

    if (!chirp) {
        throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`)
    }
    respondWithJSON(res, 200, chirp);
}