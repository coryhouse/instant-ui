"use client";
import Dexie, { type EntityTable } from "dexie";
import type { LfTodo } from "./server-store";

/**
 * The local database (IndexedDB via Dexie) is the source of truth for the UI.
 * `dirty: 1` marks rows changed locally but not yet confirmed by the server:
 * together they ARE the outbox. (IndexedDB can't index booleans, hence 0/1.)
 */
export type LocalTodo = LfTodo & { dirty: 0 | 1 };

export const db = new Dexie("instant-ui-local-first") as Dexie & {
  todos: EntityTable<LocalTodo, "id">;
  meta: EntityTable<{ key: string; value: number }, "key">;
};
db.version(1).stores({ todos: "id, createdAt, dirty", meta: "key" });

// Writes are local and instant; the sync loop pushes them later.
export async function addLocal(text: string) {
  const now = Date.now();
  await db.todos.add({ id: crypto.randomUUID(), text, done: false, deleted: false, createdAt: now, updatedAt: now, dirty: 1 });
}
export async function toggleLocal(id: string) {
  const todo = await db.todos.get(id);
  if (todo) await db.todos.update(id, { done: !todo.done, updatedAt: Date.now(), dirty: 1 });
}
export async function deleteLocal(id: string) {
  await db.todos.update(id, { deleted: true, updatedAt: Date.now(), dirty: 1 }); // soft delete so it can sync
}
