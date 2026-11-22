import { connection } from "next/server";
import { getHttpStats, payload } from "@/lib/caching/http-stats";
import { delay } from "@/lib/server-settings";

// Revalidation: `no-cache` means "store it, but ask me before reusing it".
// The browser sends If-None-Match; if the version hasn't changed we answer
// 304 Not Modified with no body and skip the expensive work.
const VERSION = '"deals-v1"';

export async function GET(request: Request) {
  await connection();
  if (request.headers.get("if-none-match") === VERSION) {
    getHttpStats().etag.notModified++;
    return new Response(null, { status: 304, headers: { ETag: VERSION, "Cache-Control": "no-cache" } });
  }
  await delay();
  getHttpStats().etag.full++;
  return Response.json(payload("etag"), {
    headers: { ETag: VERSION, "Cache-Control": "no-cache" },
  });
}
