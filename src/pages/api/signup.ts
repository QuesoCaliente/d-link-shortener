import { lucia } from "@/auth";
import type { APIContext } from "astro";
import { db, like, User } from "astro:db";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!username || !email) {
    return new Response("Missing username or email", { status: 400 });
  }
  if (typeof username !== "string" || typeof email !== "string") {
    return new Response("Invalid username or email", { status: 400 });
  }
  if (username.length < 3 || username.length > 20) {
    return new Response("Username must be between 3 and 20 characters", {
      status: 400,
    });
  }
  if (password && typeof password !== "string") {
    return new Response("Invalid password", { status: 400 });
  }
  if (password && password.length < 8) {
    return new Response("Password must be at least 8 characters", {
      status: 400,
    });
  }

  const user = await db.select().from(User).where(like(User.email, email));

  if (user) {
    return new Response("User already exists", { status: 400 });
  }

  const userId = generateId(15);

  const hashedPassword = password ? await new Argon2id().hash(password) : null;

  await db.insert(User).values({
    id: userId,
    username,
    email,
    password: hashedPassword,
  });

  // Generate session
  const session = await lucia.createSession(userId, {});
  const cookie = lucia.createSessionCookie(session.id);
  context.cookies.set(cookie.name, cookie.value, cookie.attributes);

  return context.redirect("/");
}
