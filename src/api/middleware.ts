import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { BadRequestError, UserNotAuthenticatedError, UserForbiddenError, NotFoundError } from "./errors.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
        const statusCode = res.statusCode;

        if (statusCode < 200 || statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
    next();
}

export function middlewareMetricsInc(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    config.fileserverHits++;
    next();
}

export function errorMiddlware(err: Error, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500;
    let message = "Something went wrong on our end";
    //console.log(err.message);
    if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UserNotAuthenticatedError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof UserForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }
    respondWithError(res, statusCode, message);
}

