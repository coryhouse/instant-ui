"use client";
import { startTransition, useState, ViewTransition } from "react";
import { CARDS, type Card } from "./data";

type Filter = "all" | Card["kind"];

function visible(filter: Filter, reversed: boolean) {
  const items = CARDS.filter((c) => filter === "all" || c.kind === filter);
  return reversed ? items.toReversed() : items;
}

/**
 * Filter + reorder a list.
 * NAIVE (animated=false): plain setState, items pop in, out, and jump.
 * INSTANT (animated=true): each item gets a keyed <ViewTransition> and the update
 * runs in startTransition, so items slide to their new spot and fade in/out.
 */
export function ReorderList({ animated }: { animated: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [reversed, setReversed] = useState(false);
  const update = (fn: () => void) => (animated ? startTransition(fn) : fn());

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 text-xs">
        {(["all", "fruit", "veg"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => update(() => setFilter(f))}
            className={`rounded-md border px-2 py-1 ${f === filter ? "border-accent bg-accent/15" : "border-border"}`}
          >
            {f}
          </button>
        ))}
        <button type="button" onClick={() => update(() => setReversed((r) => !r))} className="rounded-md border border-border px-2 py-1">
          ⇅ Reverse
        </button>
      </div>
      <ul className="space-y-1">
        {visible(filter, reversed).map((c) =>
          animated ? (
            <ViewTransition key={c.id}>
              <Item card={c} />
            </ViewTransition>
          ) : (
            <Item key={c.id} card={c} />
          ),
        )}
      </ul>
    </div>
  );
}

function Item({ card }: { card: Card }) {
  return (
    <li className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 text-sm">
      <span aria-hidden>{card.emoji}</span> {card.title}
      <span className="ml-auto text-xs text-muted">{card.kind}</span>
    </li>
  );
}
