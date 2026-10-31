import { getVendors } from '@/lib/data';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { GlobalSearch } from '@/components/global-search';
import { supabase } from '@/lib/supabase';
import { AnnouncementBanner } from '@/components/ui/announcement-banner';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const vendors = await getVendors();
  
  const vendorsWithRatings = await Promise.all(
    vendors.map(async (vendor) => {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("vendor_id", vendor.id);

      const avg =
        reviews && reviews.length > 0
          ? reviews.reduce((sum, r: any) => sum + r.rating, 0) / reviews.length
          : 0;

      return {
        ...vendor,
        avgRating: avg,
        reviewCount: reviews?.length || 0,
      };
    })
  );

  const featuredVendors = [...vendorsWithRatings]
    .sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-background pb-20">
      
      <HeroGeometric
        badge="Java Bites"
        title1="SRM's Food Court"
        title2="Every stall. Every menu."
        title3="No guesswork"
        subtitle="The SRM food court — finally in one place."
      />

      <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-6 sm:pt-10">
        <GlobalSearch vendors={vendors} />
        <div className="mt-5 flex justify-center sm:justify-start">
          <Link href="/vendors">
            <Button 
              size="lg" 
              className="h-12 rounded-lg bg-primary px-5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
            >
              Browse All Vendors <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <AnnouncementBanner />
      </div>

      {/* Featured Vendors */}
      <section className="mx-auto mb-8 mt-14 max-w-6xl px-5 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">Featured vendors</h2>
          <Link 
            href="/vendors" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {featuredVendors.map(vendor => (
            <SpotlightCard key={vendor.id} className="h-full">
              <Link href={`/vendors/${vendor.slug || vendor.id}`} className="block h-full p-3 sm:p-4">
                <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl">
                  <Image 
                    src={vendor.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2947&auto=format&fit=crop'} 
                    alt={vendor.name} 
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-lg font-medium">{vendor.name}</h3>
                    <p className="text-sm text-white/75">{vendor.cuisine_type}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {vendor.location_in_court}
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4 fill-current" /> {vendor.avgRating > 0 ? vendor.avgRating.toFixed(1) : "New"}
                  </span>
                </div>
              </Link>
            </SpotlightCard>
          ))}
        </div>
      </section>

    </main>
  );
}
