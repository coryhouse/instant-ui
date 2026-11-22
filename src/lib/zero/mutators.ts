// Custom mutators. The SAME code runs twice:
//  1. in the browser, against the local replica -> UI updates in the same frame
//  2. on the server (/api/zero/mutate), against Postgres -> the authoritative write
// If the server run fails, Zero rolls back the optimistic client change.
import { defineMutator, defineMutators } from "@rocicorp/zero";
import { validator, isRecord } from "./validate";

const isAdd = (v: unknown): v is { id: string; title: string; createdAt: number } =>
  isRecord(v) && typeof v.id === "string" && typeof v.title === "string" && v.title.trim().length > 0 && typeof v.createdAt === "number";
const isToggle = (v: unknown): v is { id: string; done: boolean } =>
  isRecord(v) && typeof v.id === "string" && typeof v.done === "boolean";
const isRemove = (v: unknown): v is { id: string } => isRecord(v) && typeof v.id === "string";

export const mutators = defineMutators({
  todo: {
    add: defineMutator(validator(isAdd), async ({ tx, args }) => {
      await tx.mutate.todo.insert({ id: args.id, title: args.title.trim(), done: false, created_at: args.createdAt });
    }),
    toggle: defineMutator(validator(isToggle), async ({ tx, args }) => {
      await tx.mutate.todo.update({ id: args.id, done: args.done });
    }),
    remove: defineMutator(validator(isRemove), async ({ tx, args }) => {
      await tx.mutate.todo.delete({ id: args.id });
    }),
  },
});
