// Generates a deliberately large client-side module for the lazy-loading demo:
// an ~80,000-word "spell-check dictionary" (~800 KB) that the editor imports.
// Run: node scripts/generate-heavy-module.mjs
import { writeFileSync } from "node:fs";

const syllables = ["ka", "ri", "to", "men", "sha", "lo", "vex", "qui", "dra", "pel", "zor", "ni", "ul", "bre", "sta", "mo", "gan", "fi", "tor", "ep"];
let seed = 42;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

const words = new Set(["the", "a", "and", "is", "it", "to", "of", "instant", "fast", "lazy", "loading", "editor", "react", "page", "code", "load", "this", "that", "with", "you", "your", "user", "only", "when", "need", "what", "click", "bundle", "ship", "less", "javascript", "type", "here", "hello", "world", "markdown", "bold", "text"]);
while (words.size < 80000) {
  let w = "";
  const n = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < n; i++) w += syllables[Math.floor(rand() * syllables.length)];
  words.add(w);
}

const out = new URL("../src/app/frame/lazy/heavy/dictionary.json", import.meta.url);
writeFileSync(out, JSON.stringify([...words]));
console.log(`Wrote ${words.size} words`);
