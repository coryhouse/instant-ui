"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ClientMark } from "@/components/ClientMark";

// Instant: the editor lives in its own chunk that's only downloaded when it's
// first rendered (after the click). Hovering the button starts the download early.
const loadEditor = () => import("../heavy/HeavyEditor");
const HeavyEditor = dynamic(loadEditor, {
  ssr: false,
  loading: () => <div className="skeleton h-32 w-full" />,
});

export function LazyEditor() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <ClientMark name="interactive" />
      <button
        onMouseEnter={() => void loadEditor()}
        onFocus={() => void loadEditor()}
        onClick={() => setOpen(true)}
        className="rounded-lg bg-accent px-4 py-2 font-medium text-white"
      >
        ✏️ Open editor
      </button>
      {open && <HeavyEditor />}
    </div>
  );
}
