import { connection } from "next/server";
import { getHttpStats, payload } from "@/lib/caching/http-stats";
import { delay } from "@/lib/server-settings";

// Instant: the browser may reuse this response for 10s without asking (fresh),
// then serve it stale for up to 60s more while refetching in the background.
// A CDN would honor `s-maxage` the same way, shared across all users.
export async function GET() {
  await connection();
  await delay();
  getHttpStats()["max-age"].full++;
  return Response.json(payload("max-age"), {
    headers: { "Cache-Control": "public, max-age=10, stale-while-revalidate=60" },
  });
}
