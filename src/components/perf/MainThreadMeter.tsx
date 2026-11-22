"use client";
import { useEffect, useRef } from "react";

const HISTORY = 120; // frames shown in the graph

/**
 * Main-thread health: a box spun by requestAnimationFrame (JS, not CSS, so it
 * freezes whenever the main thread is blocked), live FPS, the longest recent
 * frame, and a frame-time graph. Everything updates via refs, so the meter
 * itself never triggers React renders.
 */
export function MainThreadMeter({ className = "" }: { className?: string }) {
  const spinner = useRef<HTMLDivElement>(null);
  const fpsText = useRef<HTMLSpanElement>(null);
  const worstText = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frames: number[] = [];
    let last = performance.now();
    let angle = 0;
    let lastReport = last;
    let raf = 0;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      frames.push(dt);
      if (frames.length > HISTORY) frames.shift();

      angle = (angle + dt * 0.36) % 360; // one turn per second
      if (spinner.current) spinner.current.style.transform = `rotate(${angle}deg)`;

      if (now - lastReport > 250) {
        lastReport = now;
        const recent = frames.slice(-30);
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const fps = Math.min(Math.round(1000 / avg), 999);
        const worst = Math.round(Math.max(...frames));
        if (fpsText.current) {
          fpsText.current.textContent = String(fps);
          fpsText.current.style.color = fps >= 50 ? "var(--success)" : fps >= 30 ? "var(--warning)" : "var(--danger)";
        }
        if (worstText.current) {
          worstText.current.textContent = `${worst}ms`;
          worstText.current.style.color = worst <= 50 ? "var(--success)" : worst <= 200 ? "var(--warning)" : "var(--danger)";
        }
      }
      draw(canvas.current, frames);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm ${className}`}>
      <div className="flex items-center gap-2">
        <div ref={spinner} className="h-6 w-6 rounded-md bg-accent" aria-hidden />
        <span className="text-xs text-muted">main thread</span>
      </div>
      <div className="font-mono tabular-nums">
        <span ref={fpsText} className="text-lg font-bold">
          –
        </span>{" "}
        <span className="text-xs text-muted">fps</span>
      </div>
      <div className="font-mono text-xs tabular-nums text-muted">
        longest frame (2s): <span ref={worstText} className="font-semibold">–</span>
      </div>
      <canvas ref={canvas} width={HISTORY * 2} height={32} className="h-8 w-60 max-w-full" aria-label="Frame time graph" />
    </div>
  );
}

function draw(c: HTMLCanvasElement | null, frames: number[]) {
  const ctx = c?.getContext("2d");
  if (!c || !ctx) return;
  ctx.clearRect(0, 0, c.width, c.height);
  // 16.7ms budget line
  const scale = c.height / 100; // 100ms = full height
  ctx.fillStyle = "rgba(128,128,128,0.35)";
  ctx.fillRect(0, c.height - 16.7 * scale, c.width, 1);
  frames.forEach((dt, i) => {
    const h = Math.min(dt * scale, c.height);
    ctx.fillStyle = dt <= 20 ? "#34c77b" : dt <= 50 ? "#e0a83a" : "#ff5e4e";
    ctx.fillRect(i * 2, c.height - h, 2, h);
  });
}
