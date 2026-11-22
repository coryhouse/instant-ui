import Link from "next/link";
import { ViewTransition } from "react";
import { Compare } from "@/components/Compare";
import { DemoPage } from "@/components/DemoPage";
import { CARDS } from "./data";
import { InstantGallery } from "./InstantGallery";
import { NaiveGallery } from "./NaiveGallery";
import { NAV_ENTER_EXIT } from "./nav";
import { ReorderList } from "./ReorderList";
import { Thumb } from "./Thumb";
import "./view-transitions.css";

export default function ViewTransitionsDemo() {
  return (
    <ViewTransition enter={NAV_ENTER_EXIT} exit={NAV_ENTER_EXIT} default="none">
      <div>
        <DemoPage
          slug="view-transitions"
          tryThis={[
            "Click a card on the left, then the same card on the right. Both are instant; only the right one shows you where the card went.",
            "Filter and reverse both lists: the left pops, the right slides items into place.",
            "Click a card in the page navigation strip: it morphs into the next page's hero, then the facts slide in when they load (raise the latency slider to see the skeleton).",
            "Turn on Reduce motion in your OS: everything still works, it just swaps instantly.",
          ]}
          takeaways={[
            "Animation doesn't make anything faster. It makes changes feel connected, so users don't have to re-scan the page to see what happened.",
            <>React&apos;s <code>&lt;ViewTransition&gt;</code> animates updates inside <code>startTransition</code>, Suspense reveals, and Next.js navigations. A shared <code>name</code> morphs an element between states.</>,
            "Keep it short (200–400ms) and meaningful. Long or decorative transitions make the UI feel slower.",
            <>Progressive enhancement: Chromium 125+, recent Safari and Firefox. Elsewhere it just swaps. Always respect <code>prefers-reduced-motion</code>.</>,
          ]}
        >
          <h2 className="text-lg font-semibold">Grid → detail</h2>
          <Compare naiveLabel="Hard swap (setState)" instantLabel="Shared-element morph" naive={<NaiveGallery />} instant={<InstantGallery />} />

          <h2 className="text-lg font-semibold">Filter &amp; reorder</h2>
          <Compare naiveLabel="Pops" instantLabel="Animated list" naive={<ReorderList animated={false} />} instant={<ReorderList animated />} />

          <h2 className="text-lg font-semibold">Across a page navigation</h2>
          <div className="rounded-xl border border-success/50 bg-surface p-4">
            <p className="mb-3 text-sm text-muted">
              Each card links to <code>/view-transitions/[id]</code>. Same <code>name</code> on both pages, plus{" "}
              <code>transitionTypes</code> on the Link for a directional slide. <code>{"prefetch={true}"}</code> resolves the destination before the click, so the hero is ready in the same commit and the morph can pair.
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-9">
              {CARDS.map((c) => (
                <Link key={c.id} href={`/view-transitions/${c.id}`} prefetch={true} transitionTypes={["vt-nav-forward"]} className="text-center">
                  <ViewTransition name={`vt-photo-${c.id}`} share="vt-morph" default="none">
                    <div>
                      <Thumb card={c} />
                    </div>
                  </ViewTransition>
                  <span className="text-xs">{c.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </DemoPage>
      </div>
    </ViewTransition>
  );
}
