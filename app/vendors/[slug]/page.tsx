import { Metadata } from 'next';
import { getVendorById, getVendorBySlug, getMenuItems, getReviews } from '@/lib/data';
import { notFound, permanentRedirect } from 'next/navigation';
import { isUuid } from '@/lib/utils';
import { VendorDetailClient } from './vendor-detail-client';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const paramValue = resolvedParams.slug;

  let vendor = null;
  if (isUuid(paramValue)) {
    vendor = await getVendorById(paramValue);
    if (!vendor) {
      notFound();
    }
    if (vendor.slug && vendor.slug !== paramValue) {
      permanentRedirect(`/vendors/${vendor.slug}`);
    }
  } else {
    vendor = await getVendorBySlug(paramValue);
  }

  if (!vendor) {
    notFound();
  }

  const title = `${vendor.name} — Java Bites | SRM Food Court`;
  const description = `${vendor.name} at SRMIST Java Food Court. Browse the full menu, prices, ratings, and available dishes on Java Bites.`;
  const slugUrl = `/vendors/${vendor.slug || paramValue}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: slugUrl,
    },
    openGraph: {
      title,
      description,
      url: slugUrl,
      images: vendor.image_url ? [{ url: vendor.image_url, alt: vendor.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: vendor.image_url ? [vendor.image_url] : undefined,
    },
  };
}

export default async function VendorDetail({ params }: PageProps) {
  const resolvedParams = await params;
  const paramValue = resolvedParams.slug;

  // 1. Detect if parameter is a UUID
  if (isUuid(paramValue)) {
    const vendor = await getVendorById(paramValue);
    if (!vendor) {
      notFound();
    }
    // Permanent redirect to canonical slug URL
    const targetSlug = vendor.slug;
    if (targetSlug && targetSlug !== paramValue) {
      permanentRedirect(`/vendors/${targetSlug}`);
    }
  }

  // 2. Query vendor by slug
  const vendor = await getVendorBySlug(paramValue);

  if (!vendor) {
    notFound();
  }

  // 3. Continue using UUID internally for menu items and reviews queries
  const [menuItems, reviews] = await Promise.all([
    getMenuItems(vendor.id),
    getReviews(vendor.id),
  ]);

  return (
    <VendorDetailClient 
      vendor={vendor} 
      menuItems={menuItems} 
      reviews={reviews} 
    />
  );
}