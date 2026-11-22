"use client";
import { useState } from "react";
import { SlowResults } from "./SlowResults";

/**
 * NAIVE: the input and the list read the same state.
 * Every keystroke synchronously renders ~200ms of rows before the browser can
 * paint the character you typed. Keystrokes queue up and appear in bursts.
 */
export function NaiveSearch() {
  const [query, setQuery] = useState("");
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <SlowResults query={query} />
    </>
  );
}

export function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search 10,000 animals… (type fast)"
      className="mb-3 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
    />
  );
}
