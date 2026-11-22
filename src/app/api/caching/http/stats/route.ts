import { connection } from "next/server";
import { getHttpStats, resetHttpStats } from "@/lib/caching/http-stats";

export async function GET() {
  await connection();
  return Response.json(getHttpStats(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST() {
  return Response.json(resetHttpStats(), { headers: { "Cache-Control": "no-store" } });
}
