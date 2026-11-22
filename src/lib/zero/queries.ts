// Synced queries. The client runs these against its LOCAL replica (instant),
// and zero-cache asks our /api/zero/query endpoint for the authoritative version.
import { defineQueries, defineQuery } from "@rocicorp/zero";
import { zql } from "./schema";
import { validator, isRecord } from "./validate";

export type Filter = "all" | "open" | "done";
const isFilter = (v: unknown): v is { filter: Filter } =>
  isRecord(v) && (v.filter === "all" || v.filter === "open" || v.filter === "done");

export const queries = defineQueries({
  todos: {
    list: defineQuery(validator(isFilter), ({ args: { filter } }) => {
      let q = zql.todo.orderBy("created_at", "asc");
      if (filter !== "all") q = q.where("done", filter === "done");
      return q;
    }),
  },
});
