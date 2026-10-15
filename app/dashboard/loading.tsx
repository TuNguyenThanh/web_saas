export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Loading">
      <div className="h-8 w-48 rounded-lg bg-black/5 dark:bg-white/10" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/5"
          />
        ))}
      </div>
      <div className="h-64 rounded-xl border border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/5" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
