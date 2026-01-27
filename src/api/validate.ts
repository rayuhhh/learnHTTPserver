import type { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidate(req: Request, res: Response) {
    type param = {
        body: string;
    };
    
    let bodybuffer = "";

    req.on("data", (chunk) => {
        bodybuffer += chunk.toString();
    });

    let params:param;
    req.on("end", () => {
        try {
            params = JSON.parse(bodybuffer);
            // const parseData = JSON.parse(bodybuffer);
            // const chirp = parseData.body;

            // if (!chirp || chirp.length > 140) {
            //     return res.status(400).json({
            //         error: "Chirp is too long"
            //     });
            // }
            // res.status(200).json({valid: true});
        } catch (err) {
            respondWithError(res, 400, "Something went wrong");
            // console.error(err);
            // res.status(400).json({error: "Something went wrong"});
        }

        const maxChirpLen = 140;
        if(params.body.length > maxChirpLen) {
            respondWithError(res, 400, "Chirp is too long");
            return;
        }
        respondWithJSON(res, 200, { valid: true });
    });
}