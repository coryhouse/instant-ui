import { Compare } from "@/components/Compare";
import { DemoPage } from "@/components/DemoPage";
import { PollingTodos } from "./PollingTodos";
import { SyncedTodos } from "./SyncedTodos";

export default function HandRolledSyncDemo() {
  return (
    <DemoPage
      slug="sync/hand-rolled"
      tryThis={[
        "Open this page in a second browser window, side by side. Toggle a todo on the right: it changes instantly here and appears in the other window as soon as the server confirms.",
        "Make a change on the right and watch the left (polling) panel: it lags by up to 3s + latency. Watch \"data age\" climb.",
        "Set latency to 2000ms and click quickly on the right: mutations stack up as pending (faded), then confirm in order in the sync log.",
        "Turn on \"Fail 50% of writes\": rejected mutations roll back in every window, logged as ✗ in the sync log.",
      ]}
      takeaways={[
        "A sync engine = local store + mutation queue + server log with versions + push to clients.",
        "Client view = confirmed server state + pending local mutations replayed on top (rebase). Instant UI, server stays authoritative.",
        "Push (SSE / WebSocket) beats polling: fresher data, no wasted requests. Mutations need ids so retries are safe.",
        "Don't hand-roll this for production: offline persistence, partial sync, auth and schema changes are the hard 90%. Use Zero, Replicache, Electric, etc.",
      ]}
    >
      <Compare
        naiveLabel="Polling every 3s"
        instantLabel="Sync engine (local-first + SSE push)"
        naive={<PollingTodos />}
        instant={<SyncedTodos />}
      />
    </DemoPage>
  );
}
