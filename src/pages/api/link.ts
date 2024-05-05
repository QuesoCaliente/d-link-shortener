import type { APIContext } from "astro";
import { db, eq, isDbError, Link } from "astro:db";
import { customAlphabet } from "nanoid";

export async function POST(context: APIContext): Promise<Response> {
  const user = context.locals.user;
  const session = context.locals.session;

  console.log("user in api", session);

  console.log("1");

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("2");

  const formData = await context.request.formData();

  console.log("3");

  const original = formData.get("url") as string;

  if (!original || typeof original !== "string") {
    return new Response("Missing URL", { status: 400 });
  }

  console.log("4");
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    7
  );
  let short: string | undefined;
  short = (formData.get("short") as string) ?? nanoid();

  if (!short || typeof short !== "string") {
    return new Response("Missing short URL", { status: 400 });
  }

  console.log("5");

  const formDataShort = formData.get("short");

  console.log("6");
  while (true && !formDataShort) {
    try {
      const existingLink = await db
        .select()
        .from(Link)
        .where(eq(Link.short, short));

      if (existingLink.length === 0) {
        break;
      }
    } catch (error) {
      if (isDbError(error)) {
        return new Response(`Error while database: ${error.message}`, {
          status: 500,
        });
      }
    }
    short = nanoid();
  }

  console.log("7");

  try {
    const newLink = await db.insert(Link).values([
      {
        short,
        original,
        userId: user.id,
      },
    ]);

    console.log("8");
    return new Response(short, {
      headers: {
        "Content-Type": "application/json",
      },
      status: 201,
    });
  } catch (error) {
    return new Response("Error creating link", { status: 500 });
  }
}
