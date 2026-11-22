// Generates large, deliberately UNOPTIMIZED PNGs for the image-optimization demo.
// Run: node scripts/generate-demo-images.mjs
// Everything is procedural (no downloads): a smooth "aurora" gradient plus film-grain
// noise, so PNG compression can't shrink it much — like a real camera photo exported as PNG.
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const OUT = new URL("../public/demo-images/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const images = [
  { name: "hero", w: 2400, h: 1200, hue: 250 },
  { name: "photo-1", w: 1200, h: 800, hue: 10 },
  { name: "photo-2", w: 1200, h: 800, hue: 140 },
  { name: "photo-3", w: 1200, h: 800, hue: 200 },
  { name: "photo-4", w: 1200, h: 800, hue: 300 },
  { name: "photo-5", w: 1200, h: 800, hue: 40 },
  { name: "photo-6", w: 1200, h: 800, hue: 170 },
];

function hsl(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

// Deterministic PRNG so re-running produces identical files.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

for (const [i, { name, w, h, hue }] of images.entries()) {
  const rand = rng(i + 1);
  const raw = Buffer.alloc((w * 3 + 1) * h);
  let o = 0;
  for (let y = 0; y < h; y++) {
    raw[o++] = 0; // filter: none
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const wave = Math.sin(u * 6 + Math.sin(v * 4 + i) * 2) * 0.5 + 0.5;
      const [r, g, b] = hsl((hue + wave * 60 + v * 40) % 360, 0.7, 0.25 + wave * 0.35 + (1 - v) * 0.1);
      const grain = (rand() - 0.5) * 6;
      raw[o++] = Math.max(0, Math.min(255, r + grain));
      raw[o++] = Math.max(0, Math.min(255, g + grain));
      raw[o++] = Math.max(0, Math.min(255, b + grain));
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(new URL(`${name}.png`, OUT), png);
  console.log(`${name}.png  ${w}x${h}  ${(png.length / 1024 / 1024).toFixed(2)} MB`);
}
