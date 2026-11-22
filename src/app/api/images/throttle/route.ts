import type { NextRequest } from "next/server";

/**
 * Serves a same-origin image through a simulated network link so that image
 * weight is visible on localhost. Each "pipe" (one per demo frame) is a shared
 * link of BYTES_PER_SECOND, like a real phone connection: concurrent images
 * compete for it. Responses are no-store so every reload re-downloads.
 */
const BYTES_PER_SECOND = 5_000_000; // ≈ 40 Mbps
const CHUNK = 16 * 1024;
const ALLOWED = ["/demo-images/", "/_next/image?", "/_next/static/media/"];

const g = globalThis as typeof globalThis & { __imagePipes?: Map<string, number> };
const pipes = (g.__imagePipes ??= new Map());

/** Reserve time on the pipe for `bytes`, resolving when they've "arrived". */
function transmit(pipe: string, bytes: number) {
  const now = performance.now();
  const start = Math.max(now, pipes.get(pipe) ?? 0);
  const end = start + (bytes / BYTES_PER_SECOND) * 1000;
  pipes.set(pipe, end);
  return new Promise((r) => setTimeout(r, end - now));
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") ?? "";
  const pipe = request.nextUrl.searchParams.get("pipe") ?? "default";
  if (!ALLOWED.some((p) => url.startsWith(p))) return new Response("Not allowed", { status: 400 });

  const upstream = await fetch(new URL(url, request.nextUrl.origin), {
    headers: { accept: request.headers.get("accept") ?? "*/*" },
  });
  if (!upstream.ok || !upstream.body) return new Response("Not found", { status: upstream.status });

  const reader = upstream.body.getReader();
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) return controller.close();
      for (let i = 0; i < value.length; i += CHUNK) {
        const piece = value.subarray(i, i + CHUNK);
        await transmit(pipe, piece.length);
        controller.enqueue(piece);
      }
    },
    cancel: () => reader.cancel(),
  });

  const headers = new Headers({
    "content-type": upstream.headers.get("content-type") ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("content-length", length);
  return new Response(body, { headers });
}
