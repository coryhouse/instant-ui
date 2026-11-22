/**
 * Shared by client AND server. Mutations are named, serializable "intents",
 * and `applyMutation` is a pure function both sides run — the client to predict
 * the result instantly, the server to decide the authoritative result.
 */
export type Todo = { id: string; text: string; done: boolean };

export type Mutation =
  | { name: "add"; args: { id: string; text: string } } // client picks the id, so it's stable across the round trip
  | { name: "toggle"; args: { id: string } }
  | { name: "delete"; args: { id: string } };

/** A mutation tagged with who made it and its per-client sequence number. */
export type PendingMutation = Mutation & { clientId: string; seq: number };

/** What the server pushes to every client after a change ("poke"). */
export type Poke = {
  version: number; // monotonically increasing server version
  todos: Todo[]; // authoritative state at that version
  lastSeq: Record<string, number>; // per client: last mutation the server processed
  applied: { clientId: string; seq: number; name: Mutation["name"]; ok: boolean }[];
};

export function applyMutation(todos: Todo[], m: Mutation): Todo[] {
  switch (m.name) {
    case "add": return todos.some((t) => t.id === m.args.id) ? todos : [...todos, { ...m.args, done: false }];
    case "toggle": return todos.map((t) => (t.id === m.args.id ? { ...t, done: !t.done } : t));
    case "delete": return todos.filter((t) => t.id !== m.args.id);
  }
}
