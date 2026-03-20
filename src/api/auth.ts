import { getUserByEmail } from "../db/queries/users.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js"
import { respondWithJSON } from "./json.js";
import { revokeRefreshToken, saveRefreshToken, userForRefreshToken } from "../db/queries/refresh.js";

import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";
import { config } from "../config.js";

type LoginResponse = UserResponse & {
    token: string;
    refreshToken: string;
};

export async function handlerLogin(req: Request, res: Response) {
    type UserPayload = {
        email: string;
        password: string;
    };

    const params: UserPayload = req.body;

    const user = await getUserByEmail(params.email);
    if(!user) {
        throw new UserNotAuthenticatedError("incorrect email or password");
    }

    const passwordMatch = await checkPasswordHash(params.password, user.hashedPassword);
    if (!passwordMatch) {
        throw new UserNotAuthenticatedError("incorrect email or password");
    }

    const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
    const refreshToken = makeRefreshToken();

    const saved = await saveRefreshToken(user.id, refreshToken);
    if (!saved) {
        throw new UserNotAuthenticatedError("could not save refresh token");
    }

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token,
        refreshToken: refreshToken,
        isChirpyRed: user.isChirpyRed,
    } satisfies LoginResponse);
}

export async function handlerRefresh(req: Request, res: Response) {
    let refreshToken = getBearerToken(req);

    const result = await userForRefreshToken(refreshToken);
    if (!result) {
        throw new UserNotAuthenticatedError("invalid refresh token");
    }

    const user= result.user;
    const accessToken = makeJWT(
        user.id,
        config.jwt.defaultDuration,
        config.jwt.secret,
    );

    type response = {
        token: string;
    };

    respondWithJSON(res, 200, {
        token: accessToken,
    } satisfies response);
}

export async function handlerRevoke(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    await revokeRefreshToken(refreshToken);
    res.status(204).send();
}


