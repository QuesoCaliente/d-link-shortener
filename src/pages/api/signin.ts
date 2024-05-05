import { lucia } from "@/auth";
import type { APIContext } from "astro";
import { db, eq, User } from "astro:db";
import { Argon2id } from "oslo/password";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email) {
    return new Response("Missing username or email", { status: 400 });
  }
  if (typeof email !== "string") {
    return new Response("Invalid username or email", { status: 400 });
  }
  if (password && typeof password !== "string") {
    return new Response("Invalid password", { status: 400 });
  }
  let user;
  user = (await db.select().from(User).where(eq(User.email, email))).at(0);
  if (!user) {
    user = (await db.select().from(User).where(eq(User.username, email))).at(0);
  }

  if (!user) {
    return new Response("Incorrect username or password", { status: 400 });
  }

  if (!user.password) {
    return new Response("Incorrect username or password", { status: 400 });
  }

  const validPassword = await new Argon2id().verify(user.password, password!);

  if (!validPassword) {
    return new Response("Incorrect username or password", { status: 400 });
  }

  const session = await lucia.createSession(user.id, {});
  const cookie = lucia.createSessionCookie(session.id);
  context.cookies.set(cookie.name, cookie.value, cookie.attributes);

  return context.redirect("/");
}
