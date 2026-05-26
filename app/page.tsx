import { getVendors } from '@/lib/data';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { VendorsList } from '@/components/vendors-list';
import { supabase } from '@/lib/supabase';
import { AnnouncementBanner } from '@/components/ui/announcement-banner';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Star, MapPin } from 'lucide-react';
import Link from 'next/link';

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

  const uniqueCuisines = Array.from(new Set(vendors.map(v => v.cuisine_type))) as string[];
  const featuredVendors = vendorsWithRatings.slice(0, 3);

  return (
    <main className="min-h-screen pb-20 bg-background transition-colors duration-300">
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Animated Hero */}
      <HeroGeometric
        badge="Java Bites"
        title1="SRMIST's Food Court"
        title2="Discover Every Bite"
      />

      <AnnouncementBanner />

      {/* Featured Vendors */}
      <section className="max-w-5xl mx-auto px-6 mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Featured Vendors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVendors.map(vendor => (
            <SpotlightCard key={vendor.id} className="h-full">
              <Link href={`/vendors/${vendor.id}`} className="block h-full p-5 cursor-pointer">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src={vendor.image_url} 
                    alt={vendor.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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

      {/* Vendor Section */}
      <VendorsList vendors={vendorsWithRatings} uniqueCuisines={uniqueCuisines} />

    </main>
  );
}
