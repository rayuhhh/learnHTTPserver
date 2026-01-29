import type { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidate(req: Request, res: Response) {
    type param = {
        body: string;
    };

    const params = req.body as param;
    
    const maxChirpLen = 140;

    if(!params.body) {
        return respondWithError(res, 400, "Something went wrong");
    }

    if (params.body.length > maxChirpLen) {
        return respondWithError(res, 400, "Chirp is too long");
    }

    respondWithJSON(res, 200, { valid: true });
    
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