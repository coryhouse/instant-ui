"use client";
import { useState } from "react";
import { ClientMark } from "@/components/ClientMark";
// Naive: a static import. The editor + its 1 MB dictionary are in this page's
// initial bundle, so every visitor downloads, parses and runs them before the
// page is interactive, even if they never click "Open editor".
import HeavyEditor from "../heavy/HeavyEditor";

export function EagerEditor() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <ClientMark name="interactive" />
      <button onClick={() => setOpen(true)} className="rounded-lg bg-accent px-4 py-2 font-medium text-white">
        ✏️ Open editor
      </button>
      {open && <HeavyEditor />}
    </div>
  );
}
