"use client";
import { useState } from "react";
// ~1 MB of words. Anything that imports this file statically pays for it on page load.
import words from "./dictionary.json";

// Module-level work runs as soon as the chunk is evaluated, i.e. during page load
// for an eager import, or only on demand for a lazy one.
const dictionary = new Set<string>(words);

/** A "rich" markdown editor with live preview and spell-check. Deliberately heavy. */
export default function HeavyEditor() {
  const [text, setText] = useState("Lazy loading is **fast**. Only ship code the usr needs.");
  const tokens = text.split(/(\s+)/);
  return (
    <div className="grid gap-2 rounded-lg border border-border bg-surface p-2 sm:grid-cols-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-28 w-full rounded border border-border bg-background p-2 font-mono text-sm"
        aria-label="Markdown"
      />
      <div className="h-28 overflow-auto rounded border border-border p-2 text-sm">
        {tokens.map((t, i) => {
          const word = t.replace(/[^a-z]/gi, "").toLowerCase();
          const bold = /^\*\*.*\*\*[.,!?]?$/.test(t);
          const misspelled = word && !dictionary.has(word);
          return (
            <span key={i} className={`${bold ? "font-bold" : ""} ${misspelled ? "underline decoration-danger decoration-wavy" : ""}`}>
              {t.replace(/\*\*/g, "")}
            </span>
          );
        })}
        <p className="mt-2 text-xs text-muted">Dictionary: {dictionary.size.toLocaleString()} words</p>
      </div>
    </div>
  );
}
