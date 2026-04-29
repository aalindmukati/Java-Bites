import { getVendorById, getMenuItems, getReviews } from '@/lib/data';
import { notFound } from 'next/navigation';
import { VendorDetailClient } from './vendor-detail-client';

export default async function VendorDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const vendor = await getVendorById(resolvedParams.id);
  
  if (!vendor) {
    notFound();
  }

  const menuItems = await getMenuItems(resolvedParams.id);
  const reviews = await getReviews(resolvedParams.id);
  
  return (
    <VendorDetailClient 
      vendor={vendor} 
      menuItems={menuItems} 
      reviews={reviews} 
    />
  );
}
