// zero-cache calls this with query names + args; we return the authoritative ZQL.
// (Clients can't send arbitrary queries — this is where you'd add per-user permissions.)
import { mustGetQuery } from "@rocicorp/zero";
import { handleQueryRequest } from "@rocicorp/zero/server";
import { queries } from "@/lib/zero/queries";
import { schema } from "@/lib/zero/schema";

export async function POST(request: Request) {
  const result = await handleQueryRequest({
    handler: (name, args) => mustGetQuery(queries, name).fn({ args }),
    schema,
    request,
    userID: null, // demo: single anonymous user
  });
  return Response.json(result);
}
