import { db } from "../index.js";
import { NewChirp, chirps, users } from "../schema.js";
import { asc, eq } from "drizzle-orm"

export async function addChirp(chirp: NewChirp) {
    
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
    return result;
}

export async function getAllChirps(authorId?: string) {
    if (authorId) {
        const result = await db
            .select()
            .from(chirps)
            .where(eq(chirps.userId, authorId))
            .orderBy(asc(chirps.createdAt));
            return result;
    } else {
        const result = await db
            .select()
            .from(chirps)
            .orderBy(asc(chirps.createdAt));
            return result;
    }
}

export async function getChirp(chirpId: string) {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    if (result.length === 0) {
        return;
    }
    return result[0];
}

export async function deleteChirp(chirpId: string, userId: string) {
    const [result] = await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId));
        return result;
}
