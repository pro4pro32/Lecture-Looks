export default function RootLoading() {
  return (
    <section className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="h-5 w-32 animate-pulse rounded bg-zinc-800/80" />
      <div className="h-9 w-52 animate-pulse rounded bg-zinc-800/80" />
      <div className="grid gap-3">
        <div className="h-44 animate-pulse rounded-3xl border border-zinc-700/60 bg-zinc-900/60" />
        <div className="h-44 animate-pulse rounded-3xl border border-zinc-700/60 bg-zinc-900/60" />
      </div>
    </section>
  );
}
