import "server-only";
import { defaultSettings, type Settings } from "./settings";

// Stored on globalThis so every route/module instance in the dev server sees the same value.
const g = globalThis as typeof globalThis & { __instantUiSettings?: Settings };

export function getSettings(): Settings {
  return (g.__instantUiSettings ??= { ...defaultSettings });
}

export function setSettings(next: Partial<Settings>) {
  g.__instantUiSettings = { ...getSettings(), ...next };
  return g.__instantUiSettings;
}

/** Simulates a slow network/database. Uses the global latency slider unless overridden. */
export function delay(ms = getSettings().latency) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Throws based on the global failure rate. Call inside mutations. */
export function maybeFail(message = "Simulated server error") {
  if (Math.random() < getSettings().failRate) throw new Error(message);
}
