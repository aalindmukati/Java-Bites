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
    <main className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-6xl px-5 pb-4 pt-10 sm:px-6 sm:pt-14">
        <h1 className="mb-2 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Food court vendors</h1>
        <p className="text-muted-foreground">Browse the stalls, menus, and dishes at SRM</p>
      </div>

      <Suspense fallback={null}>
        <VendorsList vendors={vendorsWithRatings} uniqueCuisines={uniqueCuisines} />
      </Suspense>
    </main>
  );
}
