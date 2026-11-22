import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { delay } from "@/lib/server-settings";
import { CARDS, getCard } from "../data";
import { Thumb } from "../Thumb";
import { NAV_ENTER_EXIT } from "../nav";
import "../view-transitions.css";

export function generateStaticParams() {
  return CARDS.map((c) => ({ id: c.id }));
}

export default function CardPage({ params }: PageProps<"/view-transitions/[id]">) {
  return (
    <ViewTransition enter={NAV_ENTER_EXIT} exit={NAV_ENTER_EXIT} default="none">
      <article className="mx-auto max-w-xl space-y-4">
        <Link href="/view-transitions" transitionTypes={["vt-nav-back"]} className="text-sm text-muted hover:underline">
          ← Back to the demo
        </Link>
        {/* params is URL data, so it needs a Suspense boundary. The demo's links use
            prefetch={true}, which resolves it before the click: no fallback, and the morph can pair. */}
        <Suspense fallback={<div className="skeleton aspect-[4/3] w-full rounded-lg" />}>
          <CardContent params={params} />
        </Suspense>
      </article>
    </ViewTransition>
  );
}

async function CardContent({ params }: { params: PageProps<"/view-transitions/[id]">["params"] }) {
  const { id } = await params;
  const card = getCard(id);
  if (!card) notFound();
  return (
    <>
      {/* Same name as the thumbnail on the demo page: the browser morphs one into the other. */}
      <ViewTransition name={`vt-photo-${card.id}`} share="vt-morph" default="none">
        <div>
          <Thumb card={card} size="lg" />
        </div>
      </ViewTransition>
      <h1 className="text-3xl font-bold">{card.title}</h1>
      <p className="text-muted">{card.blurb}</p>

      {/* Suspense reveal: skeleton slides out, content slides in. Uses the latency slider. */}
      <Suspense
        fallback={
          <ViewTransition exit="vt-slide-down" default="none">
            <FactsSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="vt-slide-up" default="none">
          <Facts id={card.id} />
        </ViewTransition>
      </Suspense>
    </>
  );
}

async function Facts({ id }: { id: string }) {
  await delay(); // simulated slow API
  const seed = id.length * 17;
  const facts = [
    ["Calories", `${40 + (seed % 60)} kcal`],
    ["Fiber", `${(seed % 7) + 1} g`],
    ["Vitamin C", `${(seed * 3) % 90}% DV`],
    ["Rating", "★".repeat((seed % 3) + 3)],
  ];
  return (
    <dl className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface p-4 text-sm">
      {facts.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-muted">{k}</dt>
          <dd className="font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function FactsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface p-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="space-y-1">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
