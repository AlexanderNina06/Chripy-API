import { db } from "../index.js";
import { chirps } from "../../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createChirps(body: string, userId: string){
  const [chirp] = 
    await db
    .insert(chirps)
    .values({body: body, userId: userId})
    .onConflictDoNothing()
    .returning()
  return chirp;
}

export async function deleteChirpByIdAsync(chirpID: string) {
  const [deleted] = await db
    .delete(chirps)
    .where(eq(chirps.id, chirpID))
    .returning();

  return deleted; 
}

export async function getAllChirpsAsync(){
  return await db
                .select()
                .from(chirps)
                .orderBy(asc(chirps.createdAt))
}

export async function getChirpByIdAsync(chirpID: string){
  const [result] = await db
                .select()
                .from(chirps)
                .where(eq(chirps.id, chirpID))
                return result
}

export async function getChirpsByAuthorIdAsync(authorId: string) {
  return await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, authorId));
}
