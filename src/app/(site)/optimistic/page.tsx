import { Suspense } from "react";
import { Compare } from "@/components/Compare";
import { DemoPage } from "@/components/DemoPage";
import { TodoSkeleton } from "@/components/todo-ui/TodoUI";
import { getTodos } from "@/lib/db";
import { InstantTodos } from "./InstantTodos";
import { NaiveTodos } from "./NaiveTodos";

export default function OptimisticDemo() {
  return (
    <DemoPage
      slug="optimistic"
      tryThis={[
        "Set latency to 2000ms. Add a todo on each side: the left spins for 2s, the right shows it instantly (faded = pending).",
        "Rapid-fire toggle a few checkboxes on each side. The left locks up after every click.",
        "Turn on \"Fail 50% of writes\" and add a few todos on the right: failed ones vanish (rollback) with an error explaining why.",
      ]}
      takeaways={[
        <>Optimistic UI = apply the change locally <em>now</em>, reconcile with the server later. Feedback goes from ~latency to ~1 frame.</>,
        <><code>useOptimistic</code> state only lives while the transition runs, so rollback on failure is automatic: just don&apos;t commit.</>,
        "Always show that a change is pending and explain rollbacks. A silent undo is worse than a spinner.",
        "Don't use it when failure is likely or costly (payments, irreversible actions, validation-heavy forms) — wait for the server there.",
      ]}
    >
      <Suspense fallback={<Compare naive={<TodoSkeleton />} instant={<TodoSkeleton />} />}>
        <Todos />
      </Suspense>
    </DemoPage>
  );
}

async function Todos() {
  const todos = await getTodos();
  return (
    <Compare
      naiveLabel="Await the Server Action"
      instantLabel="useOptimistic + Server Action"
      naive={<NaiveTodos initial={todos} />}
      instant={<InstantTodos initial={todos} />}
    />
  );
}
