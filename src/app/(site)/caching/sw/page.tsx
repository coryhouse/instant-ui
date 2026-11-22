import { DemoPage } from "@/components/DemoPage";
import { SwDemo } from "./SwDemo";

export default function ServiceWorkerDemo() {
  return (
    <DemoPage
      slug="caching/sw"
      tryThis={[
        "Click Register SW. If \"Controls this page\" says no, do a normal reload (Shift+reload bypasses service workers).",
        "Click both GET buttons twice. The SW panel is a network miss the first time, then ~0ms from the SW cache (it refreshes in the background, so \"generated at\" lags one fetch behind).",
        "DevTools → Network → Offline, then click both again: the network-only panel fails, the SW panel still shows data.",
        "Done? Click Unregister + clear cache. Service workers work in dev because localhost counts as a secure origin.",
      ]}
      takeaways={[
        "A service worker is a programmable proxy inside the browser: you decide, per request, cache-first, network-first, or stale-while-revalidate.",
        "It survives reloads and works offline. That's the foundation of PWAs and local-first apps.",
        "Scope it narrowly, skip non-GET requests, and version your caches. A buggy SW keeps serving old code until it's replaced.",
        "Don't use it for data that must always be fresh, and prefer HTTP caching when headers alone will do: SWs add complexity and a startup cost.",
      ]}
    >
      <SwDemo />
    </DemoPage>
  );
}
