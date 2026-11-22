import "server-only";
// Server-side Postgres access for the Zero endpoints. Uses the postgres.js adapter that
// ships with @rocicorp/zero (we pass a connection string, so no extra dependency).
import { zeroPostgresJS } from "@rocicorp/zero/server/adapters/postgresjs";
import { schema } from "./schema";

export const ZERO_UPSTREAM_DB = process.env.ZERO_UPSTREAM_DB ?? "postgres://zero:zero@localhost:5434/zero";

const g = globalThis as typeof globalThis & { __zeroDb?: ReturnType<typeof zeroPostgresJS<typeof schema>> };
// One pool per dev server process (survives HMR).
export const dbProvider = (g.__zeroDb ??= zeroPostgresJS(schema, ZERO_UPSTREAM_DB));

/** Raw SQL against the same Postgres (the postgres.js adapter always implements `query`). */
export const sql = (text: string, params: unknown[] = []) => dbProvider.connection.query!(text, params);
