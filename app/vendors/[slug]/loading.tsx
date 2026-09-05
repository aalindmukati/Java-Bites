export default function VendorDetailLoading() {
  return (
    <main className="min-h-screen pb-20 bg-background text-foreground relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background opacity-80 pointer-events-none" />

      {/* Hero Banner Skeleton */}
      <div className="relative h-64 md:h-80 w-full z-0 bg-muted/40 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        {/* Back Button Skeleton */}
        <div className="w-10 h-10 rounded-full bg-secondary/80 border border-border/50 animate-pulse mb-6" />

        {/* Vendor Info Skeleton */}
        <div className="mb-10">
          <div className="h-10 w-72 bg-muted rounded-xl animate-pulse mb-3" />
          <div className="flex flex-wrap gap-4 items-center">
            <div className="h-5 w-28 bg-muted/60 rounded-md animate-pulse" />
            <div className="h-5 w-20 bg-muted/60 rounded-md animate-pulse" />
            <div className="h-5 w-32 bg-muted/60 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Menu Search Bar Skeleton */}
        <div className="h-12 w-full bg-secondary/50 border border-border/40 rounded-xl animate-pulse mb-6" />

        {/* Filters Skeleton */}
        <div className="flex flex-wrap gap-6 mb-6 items-center border-t border-b border-border/40 py-4">
          <div className="flex gap-2">
            <div className="h-7 w-16 bg-muted/50 rounded-full animate-pulse" />
            <div className="h-7 w-24 bg-muted/50 rounded-full animate-pulse" />
            <div className="h-7 w-24 bg-muted/50 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-14 bg-muted/50 rounded-full animate-pulse" />
            <div className="h-7 w-16 bg-muted/50 rounded-full animate-pulse" />
            <div className="h-7 w-20 bg-muted/50 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Category Tabs Skeleton */}
        <div className="sticky top-16 bg-background/80 backdrop-blur px-4 py-3 flex gap-2 overflow-x-auto z-20 border-b border-border/40">
          <div className="h-9 w-24 bg-muted rounded-full animate-pulse shrink-0" />
          <div className="h-9 w-28 bg-muted/60 rounded-full animate-pulse shrink-0" />
          <div className="h-9 w-24 bg-muted/60 rounded-full animate-pulse shrink-0" />
          <div className="h-9 w-20 bg-muted/60 rounded-full animate-pulse shrink-0" />
        </div>

        {/* Menu Items Skeleton */}
        <div className="space-y-10 mt-6 relative z-10">
          {[1, 2].map((catIndex) => (
            <div key={catIndex} className="space-y-3">
              <div className="h-6 w-32 bg-muted rounded-md animate-pulse mb-4" />
              {[1, 2, 3].map((itemIndex) => (
                <div 
                  key={itemIndex} 
                  className="flex justify-between items-center p-3.5 border-b border-border/40"
                >
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="w-4 h-4 bg-muted/60 rounded shrink-0 animate-pulse" />
                    <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-12 bg-muted/60 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Reviews Skeleton */}
        <div className="mt-12 relative z-10 space-y-4">
          <div className="h-6 w-24 bg-muted rounded-md animate-pulse mb-4" />
          <div className="h-44 w-full bg-secondary/30 border border-border/40 rounded-xl animate-pulse" />
        </div>
      </div>
    </main>
  );
}
