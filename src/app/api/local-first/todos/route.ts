import { connection } from "next/server";
import { delay, maybeFail } from "@/lib/server-settings";
import { getTodo, listTodos, upsert } from "@/lib/local-first/server-store";

// REST API used by the NAIVE local-first panel: every read and write is a round trip.

export async function GET() {
  await connection();
  await delay();
  return Response.json(listTodos());
}

export async function POST(request: Request) {
  const { text } = await request.json();
  await delay();
  maybeFail(`Couldn't save "${text}"`);
  const now = Date.now();
  upsert({ id: crypto.randomUUID(), text: String(text), done: false, deleted: false, createdAt: now, updatedAt: now });
  return Response.json(listTodos());
}

export async function PATCH(request: Request) {
  const { id } = await request.json();
  await delay();
  maybeFail();
  const todo = getTodo(id);
  if (todo) upsert({ ...todo, done: !todo.done, updatedAt: Date.now() });
  return Response.json(listTodos());
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await delay();
  maybeFail();
  const todo = getTodo(id);
  if (todo) upsert({ ...todo, deleted: true, updatedAt: Date.now() });
  return Response.json(listTodos());
}
