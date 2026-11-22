import { connection } from "next/server";
import { getHttpStats, payload } from "@/lib/caching/http-stats";
import { delay } from "@/lib/server-settings";

// Naive: `no-store` forbids every cache from keeping a copy, so every click
// pays the full round trip + server work.
export async function GET() {
  await connection();
  await delay();
  getHttpStats()["no-store"].full++;
  return Response.json(payload("no-store"), {
    headers: { "Cache-Control": "no-store" },
  });
}
