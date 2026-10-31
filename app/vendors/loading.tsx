export default function VendorsLoading() {
  return (
    <main className="min-h-screen pb-20 bg-background text-foreground relative overflow-hidden">
      {/* Header Skeleton */}
      <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-6 sm:pt-14">
        <div className="mb-3 h-9 w-48 animate-pulse rounded-lg bg-muted/60" />
        <div className="mb-8 h-5 w-72 animate-pulse rounded-lg bg-muted/40" />
      </div>

      {/* Search & Filter Section Skeleton */}
      <section className="px-6 pt-4 pb-6 border-b border-border/40">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Search bar */}
          <div className="h-14 max-w-2xl bg-secondary/50 border border-border/40 rounded-full animate-pulse" />

          <div className="flex flex-wrap items-center gap-4">
            {/* Cuisine pills skeleton */}
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-24 bg-muted/70 rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-muted/40 rounded-full animate-pulse" />
              <div className="h-8 w-28 bg-muted/40 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-muted/40 rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-muted/40 rounded-full animate-pulse" />
            </div>

            <div className="h-6 w-px bg-border/40 hidden md:block" />

            {/* Filter controls skeleton */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Budget */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-12 bg-muted/40 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-7 w-12 bg-muted/50 rounded-full animate-pulse" />
                  <div className="h-7 w-20 bg-muted/40 rounded-full animate-pulse" />
                  <div className="h-7 w-20 bg-muted/40 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Diet */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-10 bg-muted/40 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-7 w-12 bg-muted/50 rounded-full animate-pulse" />
                  <div className="h-7 w-14 bg-muted/40 rounded-full animate-pulse" />
                  <div className="h-7 w-20 bg-muted/40 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Today's Mess button skeleton */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-14 bg-muted/40 rounded animate-pulse" />
                <div className="h-7 w-28 bg-amber-500/10 border border-amber-500/20 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Vendors Grid Skeleton */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="h-7 w-32 bg-muted/60 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div 
                key={`grid-${i}`} 
                className="flex h-[288px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/60 animate-pulse"
              >
                <div className="h-48 bg-muted/50 w-full" />
                <div className="p-5 space-y-3 flex-1">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-1/2 bg-muted/60 rounded" />
                    <div className="h-4 w-12 bg-muted/40 rounded" />
                  </div>
                  <div className="h-4 w-20 bg-muted/40 rounded-full" />
                  <div className="h-3 w-2/3 bg-muted/30 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
