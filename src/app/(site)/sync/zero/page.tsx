import { DemoPage } from "@/components/DemoPage";
import { ZeroDemo } from "./ZeroDemo";

export default function ZeroSyncDemo() {
  return (
    <DemoPage
      slug="sync/zero"
      tryThis={[
        "Set latency to 2000ms. Add and toggle todos in both panels: Zero updates in ~1 frame, \"awaiting server…\" shows Postgres catching up.",
        "Click All / Open / Done: Zero filters instantly against the local replica; fetch waits for a round trip.",
        "Toggle in the Zero panel: the second client (and any other window) updates live. The fetch panel stays stale until you click something.",
        "Turn on \"fail 50% of writes\" and toggle in Zero: rejected writes roll back automatically. Stop zero-cache: the status pill flips, local reads still work.",
      ]}
      takeaways={[
        "A sync engine gives you optimistic UI, caching, and live updates as one primitive: queries run locally, Postgres stays the source of truth.",
        "Mutators run twice: on the client against the replica (instant), then on your server against Postgres (authoritative).",
        "Zero never lets clients send arbitrary queries: zero-cache asks your /query endpoint for the real ZQL, which is where permissions live.",
        "When not to: you need extra infrastructure (zero-cache + logical replication) and a data model that fits in client storage. Overkill for mostly-static or read-once pages.",
      ]}
    >
      <ZeroDemo />
    </DemoPage>
  );
}
