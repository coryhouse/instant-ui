"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { TimingBadge, useFeedbackTimer } from "@/components/Timing";
import { Spinner, TodoItems, buttonClass, inputClass } from "@/components/todo-ui/TodoUI";
import type { Mutation, Poke } from "@/lib/sync-engine/shared";

const POLL_MS = 3000;

/**
 * NAIVE: polling. Re-fetch everything every 3s and wait for the server on every
 * write. Other people's changes show up late (up to 3s + latency), and the
 * wasted requests keep coming even when nothing changed.
 */
export function PollingTodos() {
  const [data, setData] = useState<{ snap: Poke; at: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(0);
  const [polls, setPolls] = useState(0);
  const ids = useRef({ clientId: "", seq: 0 });
  const timer = useFeedbackTimer();

  async function pull() {
    const snap: Poke = await fetch("/api/sync/hand-rolled/pull").then((r) => r.json());
    setData({ snap, at: Date.now() });
    setPolls((n) => n + 1);
  }

  useEffect(() => {
    let stopped = false;
    let timeout: ReturnType<typeof setTimeout>;
    const loop = async () => {
      await pull().catch(() => {});
      if (!stopped) timeout = setTimeout(loop, POLL_MS);
    };
    void loop();
    const tick = setInterval(() => setNow(Date.now()), 200);
    return () => {
      stopped = true;
      clearTimeout(timeout);
      clearInterval(tick);
    };
  }, []);

  async function mutate(m: Mutation) {
    ids.current.clientId ||= `poll-${crypto.randomUUID().slice(0, 4)}`;
    timer.start();
    setBusy(true);
    const mutation = { ...m, clientId: ids.current.clientId, seq: ++ids.current.seq };
    await fetch("/api/sync/hand-rolled/push", { method: "POST", body: JSON.stringify({ mutations: [mutation] }) });
    await pull(); // ⏳ a second round trip to see our own change
    setBusy(false);
    timer.stop();
  }

  function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text") ?? "").trim();
    if (!text) return;
    form.reset();
    void mutate({ name: "add", args: { id: crypto.randomUUID(), text } });
  }

  const age = data && now ? Math.max(0, (now - data.at) / 1000) : null;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <TimingBadge ms={timer.ms} label="write" />
        <span className={`rounded-full px-2 py-0.5 font-mono text-xs ${age !== null && age > 1.5 ? "bg-warning/20 text-warning" : "bg-muted/15 text-muted"}`}>
          data age: {age === null ? "—" : `${age.toFixed(1)}s`}
        </span>
        <span className="font-mono text-xs text-muted">v{data?.snap.version ?? "?"} · {polls} polls</span>
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input name="text" placeholder="New todo" autoComplete="off" disabled={busy} className={inputClass} />
        <button disabled={busy} className={buttonClass}>
          {busy && <Spinner />} {busy ? "Saving…" : "Add"}
        </button>
      </form>
      <TodoItems
        todos={data?.snap.todos}
        disabled={busy}
        onToggle={(id) => mutate({ name: "toggle", args: { id } })}
        onDelete={(id) => mutate({ name: "delete", args: { id } })}
      />
    </div>
  );
}
