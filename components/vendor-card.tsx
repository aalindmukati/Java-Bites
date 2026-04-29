import React, { memo } from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
import { isOpen } from '@/lib/utils';

interface Vendor {
  id: string;
  name: string;
  image_url?: string;
  cuisine_type?: string;
  location_in_court?: string;
  avgRating?: number;
  reviewCount?: number;
}

interface VendorCardProps {
  vendor: Vendor;
  avgRating: number;
}

export const VendorCard = memo(function VendorCard({ vendor, avgRating }: VendorCardProps) {
  const isCurrentlyOpen = isOpen(vendor.name);

  return (
    <Link href={`/vendors/${vendor.id}`}>
      <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-white/[0.2] transition-all duration-300 cursor-pointer h-full">

        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={
              vendor.image_url ||
              'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2947&auto=format&fit=crop'
            }
            alt={vendor.name}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 rounded-xl"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2947&auto=format&fit=crop';
            }}
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Open/Closed */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isCurrentlyOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {isCurrentlyOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white">{vendor.name}</h3>

            <div className="flex items-center gap-1 text-sm text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span>{(avgRating || 0).toFixed(1)}</span>
              <span className="text-white/40 text-xs">
                ({vendor.reviewCount || 0})
              </span>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.05] text-white/60 border border-white/[0.08]">
              {vendor.cuisine_type || 'Food'}
            </span>
          </div>

          <div className="space-y-1.5 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{vendor.location_in_court || 'Food Court'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isCurrentlyOpen
                  ? 'Currently accepting orders'
                  : 'Closed for now'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
});