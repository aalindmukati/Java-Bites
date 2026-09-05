import { Suspense } from 'react';
import { getVendors } from '@/lib/data';
import { VendorsList } from '@/components/vendors-list';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
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
    <main className="min-h-screen pb-20 bg-black relative">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <h1 className="text-4xl font-bold text-white mb-2">Our Vendors</h1>
        <p className="text-white/40 mb-12">The SRM food court — finally in one place.</p>
      </div>

      <Suspense fallback={null}>
        <VendorsList vendors={vendorsWithRatings} uniqueCuisines={uniqueCuisines} />
      </Suspense>
    </main>
  );
}
