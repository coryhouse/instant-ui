// loading.tsx wraps the page in a <Suspense> boundary automatically.
// Better than a blank screen, but it's one spinner for everything.
export default function Loading() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent" />
      Loading page…
    </div>
  );
}
