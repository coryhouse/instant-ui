"use client";
import { useState } from "react";
import { CARDS, getCard } from "./data";
import { Thumb } from "./Thumb";

/**
 * NAIVE: plain setState. The grid vanishes and the detail appears in the same
 * frame. It's instant, but nothing tells your eye where the card went.
 */
export function NaiveGallery() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const card = selectedId ? getCard(selectedId) : null;

  if (card) {
    return (
      <div className="space-y-3">
        <button type="button" onClick={() => setSelectedId(null)} className="text-sm text-muted hover:underline">
          ← Back
        </button>
        <Thumb card={card} size="lg" />
        <h3 className="text-xl font-semibold">{card.title}</h3>
        <p className="text-sm text-muted">{card.blurb}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {CARDS.map((c) => (
        <button key={c.id} type="button" onClick={() => setSelectedId(c.id)} className="text-left">
          <Thumb card={c} />
          <span className="text-xs">{c.title}</span>
        </button>
      ))}
    </div>
  );
}
