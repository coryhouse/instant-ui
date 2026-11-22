// NAIVE contrast: plain REST against the same Postgres table.
// Every read and write waits for the (slow) server, then the client refetches the whole list.
import { connection } from "next/server";
import { dbProvider, sql } from "@/lib/zero/db";
import { zql } from "@/lib/zero/schema";
import { delay, maybeFail } from "@/lib/server-settings";

function unavailable(e: unknown) {
  return Response.json({ error: "Postgres unavailable. Run: pnpm zero:up", detail: String(e) }, { status: 503 });
}

export async function GET() {
  await connection();
  await delay();
  try {
    return Response.json(await dbProvider.run(zql.todo.orderBy("created_at", "asc")));
  } catch (e) {
    return unavailable(e);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  await delay();
  maybeFail();
  try {
    if (body.action === "add") {
      await sql("INSERT INTO todo (id, title, done, created_at) VALUES ($1, $2, false, $3)", [crypto.randomUUID(), String(body.title), Date.now()]);
    } else if (body.action === "toggle") {
      await sql("UPDATE todo SET done = $2 WHERE id = $1", [String(body.id), Boolean(body.done)]);
    } else if (body.action === "remove") {
      await sql("DELETE FROM todo WHERE id = $1", [String(body.id)]);
    }
    return Response.json({ ok: true });
  } catch (e) {
    return unavailable(e);
  }
}
