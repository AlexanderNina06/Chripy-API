import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../../schema.js";
import { asc, eq } from "drizzle-orm";


export async function createRefreshTokenAsync(refreshToken: NewRefreshToken){
  const [token] = 
    await db
      .insert(refreshTokens)
      .values(refreshToken)
      .onConflictDoNothing()
      .returning()
    return token
}

export async function getTokenAsync(token: string){ 
  const refreshToken = await db.query.refreshTokens.findFirst({
  where: eq(refreshTokens.token, token),
  });
  return refreshToken
}    

export async function revokeTokenAsync(token: string) {
  await db
    .update(refreshTokens)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(refreshTokens.token, token));
}