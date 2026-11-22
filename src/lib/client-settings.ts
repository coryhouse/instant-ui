"use client";
import { useSyncExternalStore } from "react";
import { defaultSettings, type Settings } from "./settings";

const KEY = "instant-ui:settings";
let settings: Settings = defaultSettings;
const listeners = new Set<() => void>();
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) settings = { ...defaultSettings, ...JSON.parse(saved) };
  } catch {}
  // Keep the server's simulated network in sync with this browser's slider.
  void pushToServer(settings);
}

function pushToServer(s: Settings) {
  return fetch("/api/settings", { method: "POST", body: JSON.stringify(s) }).catch(() => {});
}

export function updateSettings(next: Partial<Settings>) {
  settings = { ...settings, ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {}
  listeners.forEach((l) => l());
  return pushToServer(settings);
}

/** Read the current settings from client code (e.g. to simulate latency for purely client-side work). */
export function getClientSettings() {
  load();
  return settings;
}

export function useSettings() {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => settings,
    () => defaultSettings,
  );
}

/** Client-side equivalent of the server's delay(): waits for the slider's latency. */
export function clientDelay(ms = getClientSettings().latency) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
