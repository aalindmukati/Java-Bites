import { getVendors } from '@/lib/data';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { VendorsList } from '@/components/vendors-list';
import { supabase } from '@/lib/supabase';

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

  return (
    <main className="min-h-screen pb-20 bg-[#030303]">

      {/* Animated Hero */}
      <HeroGeometric
        badge="Java Bites"
        title1="SRMIST's Food Court"
        title2="Discover Every Bite"
      />

      {/* Vendor Section */}
      <VendorsList vendors={vendorsWithRatings} uniqueCuisines={uniqueCuisines} />

    </main>
  );
}
