import { getVendorById, getMenuItems, getReviews } from '@/lib/data';
import { notFound } from 'next/navigation';
import { VendorDetailClient } from './vendor-detail-client';

export const dynamic = 'force-dynamic';

export default async function VendorDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const [vendor, menuItems, reviews] = await Promise.all([
    getVendorById(resolvedParams.id),
    getMenuItems(resolvedParams.id),
    getReviews(resolvedParams.id),
  ]);
  
  if (!vendor) {
    notFound();
  }
  
  return (
    <VendorDetailClient 
      vendor={vendor} 
      menuItems={menuItems} 
      reviews={reviews} 
    />
  );
}
