import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq, and } from "drizzle-orm";

// export async function createUser(user: NewUser) {
//   const [result] = await db
//     .insert(users)
//     .values(user)
//     .onConflictDoNothing()
//     .returning();
//   return result;
// }

export async function createUser(email: string, password: string) {
  const [result] = await db
    .insert(users)
    .values({email: email,
      hashedPassword: password,
    })
    .returning();
    return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(
      eq(users.email, email));
  return user;
}

export async function updateEmailPw(id: string, email: string, hashedPassword: string) {
  const [update] = await db
    .update(users)
    .set({
      email: email,
      hashedPassword: hashedPassword,
    })
    .where(eq(users.id, id))
    .returning();

    return update;
}

export async function upgradeRed(id: string) {
  const [update] = await db
    .update(users)
    .set({isChirpyRed: true})
    .where(eq(users.id, id))
    .returning();
  return update;
}

