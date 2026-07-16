import { getVendors } from '@/lib/data';
import { VendorsList } from '@/components/vendors-list';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
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
        <Link href="/">
          <Button variant="ghost" className="text-white/60 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">Our Vendors</h1>
        <p className="text-white/40 mb-12">Discover the best food SRMIST has to offer.</p>
      </div>

      <VendorsList vendors={vendorsWithRatings} uniqueCuisines={uniqueCuisines} />
    </main>
  );
}
