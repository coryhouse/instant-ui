import { delay } from "@/lib/server-settings";
import { push } from "@/lib/sync-engine/server";
import type { PendingMutation } from "@/lib/sync-engine/shared";

/** Clients push their queued mutations here. Results go out to everyone via SSE. */
export async function POST(request: Request) {
  const { mutations } = (await request.json()) as { mutations: PendingMutation[] };
  await delay(); // simulated network latency
  return Response.json({ applied: push(mutations) });
}
