import { connection } from "next/server";
import { snapshot, subscribe } from "@/lib/sync-engine/server";
import type { Poke } from "@/lib/sync-engine/shared";

/**
 * Server-Sent Events: one long-lived response per client. We send the current
 * snapshot immediately, then a poke after every change. Cleans up when the
 * client disconnects (tab closed, navigation, HMR reload).
 */
export async function GET(request: Request) {
  await connection();
  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const write = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          cleanup(); // stream already closed
        }
      };
      const send = (poke: Poke) => write(`data: ${JSON.stringify(poke)}\n\n`);

      send(snapshot());
      const unsubscribe = subscribe(send);
      const heartbeat = setInterval(() => write(": ping\n\n"), 15_000); // keep proxies from closing it

      cleanup = () => {
        unsubscribe();
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {}
      };
      request.signal.addEventListener("abort", () => cleanup());
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}
