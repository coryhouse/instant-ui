import { Compare } from "@/components/Compare";
import { DemoPage } from "@/components/DemoPage";
import { LocalFirstTodos } from "./LocalFirstTodos";
import { NaiveServerTodos } from "./NaiveServerTodos";
import { OfflineToggle } from "./OfflineToggle";

export default function LocalFirstDemo() {
  return (
    <DemoPage
      slug="local-first"
      tryThis={[
        "Set latency to 2000ms. Add and toggle todos on both sides: the left waits on every click, the right is instant.",
        "Turn on \"Simulate offline\". The left breaks; the right keeps working and the outbox count climbs.",
        "Turn offline off: the outbox drains and the left panel's \"Reload from server\" shows the synced changes.",
        "Hard-reload the page: the right panel renders from IndexedDB immediately, the left waits for the server again.",
      ]}
      takeaways={[
        "Local-first: the UI only talks to a local database. Reads and writes take ~0ms and work offline.",
        "Sync is a background job: push an outbox of local changes, pull remote changes since the last version.",
        <>This demo resolves conflicts with last-write-wins on <code>updatedAt</code>. That can lose edits; for real collaboration use CRDTs (Yjs, Automerge) or a sync engine.</>,
        "Not for everything: data that's huge, highly sensitive, or must be authoritative right now (inventory, payments) still belongs on the server.",
      ]}
    >
      <OfflineToggle />
      <Compare
        naiveLabel="Server is the source of truth"
        instantLabel="IndexedDB (Dexie) is the source of truth"
        naive={<NaiveServerTodos />}
        instant={<LocalFirstTodos />}
      />
    </DemoPage>
  );
}
