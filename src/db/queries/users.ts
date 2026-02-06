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

