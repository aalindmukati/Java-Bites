import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { isOpen } from '@/lib/utils';

interface Vendor {
  id: string;
  slug?: string;
  name: string;
  image_url?: string;
  is_open?: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
  avgRating?: number;
}

export const VendorCard = memo(function VendorCard({ vendor }: VendorCardProps) {
  const [isCurrentlyOpen, setIsCurrentlyOpen] = React.useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop';
  const [imgSrc, setImgSrc] = React.useState(vendor.image_url || fallbackImage);

  React.useEffect(() => {
    setIsCurrentlyOpen(isOpen(vendor.name, vendor.is_open));
  }, [vendor.name, vendor.is_open]);

  React.useEffect(() => {
    setImgSrc(vendor.image_url || fallbackImage);
  }, [vendor.image_url]);

  return (
    <Link href={`/vendors/${vendor.slug || vendor.id}`} className="block h-full">
      <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-150 hover:border-primary/50 active:scale-[0.99] h-full flex flex-col justify-between">
        
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imgSrc}
            alt={vendor.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => {
              setImgSrc(fallbackImage);
            }}
            loading="lazy"
          />

          {/* Subtle Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

          {/* Open/Closed Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                isCurrentlyOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {isCurrentlyOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Minimal Vendor Name */}
        <div className="p-4">
          <h3 className="text-base font-medium text-foreground truncate transition-colors group-hover:text-primary">
            {vendor.name}
          </h3>
        </div>

      </div>
    </Link>
  );
});
