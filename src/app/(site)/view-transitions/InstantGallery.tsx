"use client";
import { startTransition, useState, ViewTransition } from "react";
import { CARDS, getCard } from "./data";
import { Thumb } from "./Thumb";

/**
 * INSTANT (feels it): same state change, wrapped in startTransition, and the
 * thumbnail + hero share a ViewTransition `name`. React asks the browser to
 * morph one into the other, so the eye follows the card into its detail view.
 */
export function InstantGallery() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const card = selectedId ? getCard(selectedId) : null;
  const select = (id: string | null) => startTransition(() => setSelectedId(id));

  if (card) {
    return (
      <div className="space-y-3">
        <button type="button" onClick={() => select(null)} className="text-sm text-muted hover:underline">
          ← Back
        </button>
        <ViewTransition name={`vt-card-${card.id}`} share="vt-morph" default="none">
          <div>
            <Thumb card={card} size="lg" />
          </div>
        </ViewTransition>
        <ViewTransition enter="vt-slide-up" exit="vt-slide-down" default="none">
          <div>
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-sm text-muted">{card.blurb}</p>
          </div>
        </ViewTransition>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {CARDS.map((c) => (
        <button key={c.id} type="button" onClick={() => select(c.id)} className="text-left">
          <ViewTransition name={`vt-card-${c.id}`} share="vt-morph" default="none">
            <div>
              <Thumb card={c} />
            </div>
          </ViewTransition>
          <span className="text-xs">{c.title}</span>
        </button>
      ))}
    </div>
  );
}
