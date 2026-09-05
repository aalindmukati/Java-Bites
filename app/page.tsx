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
    <main className="min-h-screen pb-24 bg-background transition-colors duration-300">
      
      {/* Animated Hero */}
      <HeroGeometric
        badge="Java Bites"
        title1="SRMs's Food Court"
        title2="Every stall Every menu No Hassle."
      />

      {/* Global Search & Primary CTA */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-30 space-y-6">
        <GlobalSearch vendors={vendors} />

        <div className="flex justify-center">
          <Link href="/vendors">
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              Browse All Vendors <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <AnnouncementBanner />
      </div>

      {/* Featured Vendors */}
      <section className="max-w-5xl mx-auto px-6 mt-12 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Featured Vendors</h2>
          <Link 
            href="/vendors" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVendors.map(vendor => (
            <SpotlightCard key={vendor.id} className="h-full">
              <Link href={`/vendors/${vendor.slug || vendor.id}`} className="block h-full p-5 cursor-pointer">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative">
                  <Image 
                    src={vendor.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2947&auto=format&fit=crop'} 
                    alt={vendor.name} 
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-lg">{vendor.name}</h3>
                    <p className="text-sm text-white/80">{vendor.cuisine_type}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground mt-4">
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
