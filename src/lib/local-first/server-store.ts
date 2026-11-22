import "server-only";

/**
 * Server side of the local-first demo: an in-memory table of todos.
 * Every row has `updatedAt` (client clock, for last-write-wins) and `version`
 * (server counter, so clients can ask "what changed since version N?").
 * Deletes are soft (`deleted: true`) so the delete itself can sync.
 */
export type LfTodo = { id: string; text: string; done: boolean; deleted: boolean; createdAt: number; updatedAt: number };
type Row = LfTodo & { version: number };

type Store = { version: number; rows: Map<string, Row> };
const g = globalThis as typeof globalThis & { __instantUiLocalFirst?: Store };
const store = (g.__instantUiLocalFirst ??= (() => {
  const rows = new Map<string, Row>();
  ["Pack for the conference", "Charge the clicker", "Test demos offline"].forEach((text, i) =>
    rows.set(`seed-${i}`, { id: `seed-${i}`, text, done: i === 0, deleted: false, createdAt: i, updatedAt: i, version: i + 1 }),
  );
  return { version: 3, rows };
})());

export function listTodos(): LfTodo[] {
  return [...store.rows.values()].filter((r) => !r.deleted).sort((a, b) => a.createdAt - b.createdAt).map(strip);
}

export function getTodo(id: string) {
  const row = store.rows.get(id);
  return row ? strip(row) : undefined;
}

/** Last-write-wins: keep whichever version of the row was edited most recently. */
export function upsert(todo: LfTodo) {
  const existing = store.rows.get(todo.id);
  if (existing && existing.updatedAt >= todo.updatedAt) return false;
  store.rows.set(todo.id, { ...todo, version: ++store.version });
  return true;
}

export function changesSince(version: number) {
  return { version: store.version, changes: [...store.rows.values()].filter((r) => r.version > version).map(strip) };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function strip({ version, ...todo }: Row): LfTodo {
  return todo;
}
