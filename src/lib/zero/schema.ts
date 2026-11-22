// Zero schema: mirrors the Postgres `todo` table (see zero/init.sql).
// Shared by the browser client and the server endpoints.
import { boolean, createBuilder, createSchema, number, string, table } from "@rocicorp/zero";

const todo = table("todo")
  .columns({
    id: string(),
    title: string(),
    done: boolean(),
    created_at: number(),
  })
  .primaryKey("id");

export const schema = createSchema({ tables: [todo] });
export type Schema = typeof schema;

/** Typed ZQL query builder: zql.todo.where(...).orderBy(...) */
export const zql = createBuilder(schema);

// Register the schema as the default so queries/mutators are typed everywhere.
declare module "@rocicorp/zero" {
  interface DefaultTypes {
    schema: Schema;
  }
}
