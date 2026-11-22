import { delay, maybeFail } from "@/lib/server-settings";
import { changesSince, upsert, type LfTodo } from "@/lib/local-first/server-store";

/**
 * Sync endpoint for the INSTANT local-first panel. One request does both halves:
 *   push: apply the client's queued changes (last-write-wins by updatedAt)
 *   pull: return every row that changed since the client's last known version
 */
export async function POST(request: Request) {
  const { changes, since } = (await request.json()) as { changes: LfTodo[]; since: number };
  await delay();
  maybeFail("Sync failed (will retry)");
  for (const change of changes) upsert(change);
  return Response.json(changesSince(since));
}
