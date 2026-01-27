import type { Request, Response } from "express";
import { config } from "../config.js";


export async function handlerMetrics(_: Request, res: Response) {
    const html= `
    <html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${config.fileserverHits} times!</p>
        </body>
    </html>
    `;
    // <meta charset="utf-8">

    res
        .set("Content-Type", "text/html; charset=utf-8")
        .send(html);
        //.send(`Hits: ${config.fileserverHits}`);
}