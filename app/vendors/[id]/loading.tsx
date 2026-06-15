import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MapPin } from 'lucide-react';

export default function VendorDetailLoading() {
  return (
    <main className="min-h-screen pb-20 bg-background text-foreground relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background opacity-80 pointer-events-none" />

      {/* Header Skeleton */}
      <div className="relative h-64 md:h-80 w-full z-0 bg-neutral-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <div className="absolute top-6 left-6">
          <Button variant="secondary" size="icon" className="rounded-full bg-background/50 backdrop-blur-md cursor-default pointer-events-none" disabled>
            <ArrowLeft className="w-5 h-5 opacity-40" />
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        {/* Vendor Info Skeleton */}
        <div className="mb-10 animate-pulse">
          {/* Name skeleton */}
          <div className="h-10 bg-neutral-800 rounded-lg w-1/3 mb-4" />
          
          {/* Location/Metadata skeleton */}
          <div className="flex flex-wrap gap-4 items-center">
            <span className="flex items-center text-muted-foreground/40">
              <MapPin className="w-4 h-4 mr-1 opacity-40" />
              <span className="h-4 bg-neutral-800 rounded w-24" />
            </span>
            <span className="flex items-center text-muted-foreground/40">
              <Star className="w-4 h-4 mr-1 opacity-40" />
              <span className="h-4 bg-neutral-800 rounded w-16" />
            </span>
          </div>
        </div>

        {/* Budget Filter Skeleton */}
        <div className="flex gap-2 mt-8 mb-4 overflow-x-auto pb-2 animate-pulse">
          <div className="h-8 bg-neutral-800 rounded-full w-16 shrink-0" />
          <div className="h-8 bg-neutral-800 rounded-full w-28 shrink-0" />
          <div className="h-8 bg-neutral-800 rounded-full w-28 shrink-0" />
        </div>

        {/* Category Tabs Skeleton */}
        <div className="sticky top-0 bg-background/80 backdrop-blur px-4 py-3 flex gap-2 overflow-x-auto z-20 border-b border-border animate-pulse">
          <div className="h-9 bg-neutral-800 rounded-full w-20 shrink-0" />
          <div className="h-9 bg-neutral-800 rounded-full w-24 shrink-0" />
          <div className="h-9 bg-neutral-800 rounded-full w-24 shrink-0" />
        </div>

        {/* Menu Items Skeleton */}
        <div className="space-y-10 mt-6 relative z-10 animate-pulse">
          {[1, 2].map((categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              {/* Category Title skeleton */}
              <div className="h-6 bg-neutral-800 rounded-md w-1/4 mb-4" />

              {/* Items skeletons */}
              {[1, 2, 3].map((itemIndex) => (
                <div 
                  key={itemIndex} 
                  className="flex justify-between items-center p-3 border-b border-border"
                >
                  <div className="flex items-center gap-3 w-1/2">
                    {/* Veg indicator skeleton */}
                    <div className="w-4 h-4 bg-neutral-800 rounded shrink-0" />
                    {/* Item Name skeleton */}
                    <div className="h-5 bg-neutral-800 rounded w-3/4" />
                  </div>
                  {/* Price skeleton */}
                  <div className="h-5 bg-neutral-800 rounded w-12" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
