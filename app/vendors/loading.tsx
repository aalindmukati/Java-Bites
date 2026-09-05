export default function VendorsLoading() {
  return (
    <main className="min-h-screen pb-20 bg-background text-foreground relative overflow-hidden">
      {/* Header Skeleton */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <div className="h-10 w-48 bg-muted rounded-xl animate-pulse mb-3" />
        <div className="h-5 w-72 bg-muted/60 rounded-lg animate-pulse mb-12" />
      </div>

      {/* Search & Filter Section Skeleton */}
      <section className="px-6 pt-4 pb-6 border-b border-border/40">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="h-14 flex-1 max-w-2xl bg-secondary/50 border border-border/40 rounded-full animate-pulse" />
            <div className="h-14 w-36 bg-secondary/50 border border-border/40 rounded-full animate-pulse" />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Cuisine pills skeleton */}
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-24 bg-muted rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-muted/60 rounded-full animate-pulse" />
              <div className="h-8 w-28 bg-muted/60 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-muted/60 rounded-full animate-pulse" />
            </div>

            <div className="h-6 w-px bg-border/40 hidden md:block" />

            {/* Filter controls skeleton */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex gap-2">
                <div className="h-7 w-16 bg-muted/50 rounded-full animate-pulse" />
                <div className="h-7 w-20 bg-muted/50 rounded-full animate-pulse" />
                <div className="h-7 w-20 bg-muted/50 rounded-full animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 w-14 bg-muted/50 rounded-full animate-pulse" />
                <div className="h-7 w-16 bg-muted/50 rounded-full animate-pulse" />
                <div className="h-7 w-20 bg-muted/50 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Now Section Skeleton */}
      <section className="px-6 pt-12 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-7 w-36 bg-muted rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div 
                key={`pop-${i}`} 
                className="h-64 rounded-2xl bg-card/60 border border-border/50 animate-pulse flex flex-col overflow-hidden"
              >
                <div className="h-36 bg-muted/60 w-full" />
                <div className="p-4 space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted/40 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Vendors Grid Skeleton */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="h-7 w-32 bg-muted rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div 
                key={`grid-${i}`} 
                className="h-72 rounded-2xl bg-card/60 border border-border/50 animate-pulse flex flex-col overflow-hidden"
              >
                <div className="h-44 bg-muted/60 w-full" />
                <div className="p-5 space-y-3 flex-1">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-1/2 bg-muted rounded" />
                    <div className="h-4 w-12 bg-muted/50 rounded" />
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
