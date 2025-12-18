import { db } from "../index.js";
import { NewUser, users } from "../../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createUserAsync(user: NewUser){
  const [result] = 
  await db
  .insert(users)
  .values(user)
  .onConflictDoNothing()
  .returning()
  return result;
}

export async function updateUserAsync(params: {
  userId: string;
  email: string;
  hashedPassword: string;
}) {
  const [user] = await db
    .update(users)
    .set({
      email: params.email,
      hashedPassword: params.hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(users.id, params.userId))
    .returning();

  return user;
}

export async function upgradeChirpRedByIdAsync(userId: string) {
  await db
    .update(users)
    .set({
      isChirpyRed: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function getUserByEmailAsync(email: string){
  const [result] = 
  await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  return result;
}

export async function getUserByIdAsync(userId: string){
  const [result] = 
  await db
  .select()
  .from(users)
  .where(eq(users.id, userId))
  return result;
}

export async function resetUsersAsync(){
  await db.delete(users);
}