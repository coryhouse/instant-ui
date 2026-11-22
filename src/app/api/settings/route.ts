import { connection } from "next/server";
import { getSettings, setSettings } from "@/lib/server-settings";

export async function GET() {
  await connection();
  return Response.json(getSettings());
}

export async function POST(request: Request) {
  const body = await request.json();
  const latency = Number(body.latency);
  const failRate = Number(body.failRate);
  return Response.json(
    setSettings({
      ...(Number.isFinite(latency) && { latency: Math.max(0, Math.min(10000, latency)) }),
      ...(Number.isFinite(failRate) && { failRate: Math.max(0, Math.min(1, failRate)) }),
    }),
  );
}
