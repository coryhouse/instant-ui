import { connection } from "next/server";
import { delay } from "@/lib/server-settings";
import { snapshot } from "@/lib/sync-engine/server";

/** Used by the NAIVE polling client: "give me everything, again". */
export async function GET() {
  await connection();
  await delay();
  return Response.json(snapshot());
}
