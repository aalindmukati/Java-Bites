'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReviewForm } from './review-form';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { VegIndicator } from '@/components/ui/veg-indicator';

export function VendorDetailClient({ vendor, menuItems, reviews }: any) {
  const [budget, setBudget] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  // Group menu items by category
  const groupedMenu = useMemo(() => {
    const grouped = menuItems.reduce((acc: Record<string, any[]>, item: any) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
    return grouped;
  }, [menuItems]);

  const categories = Object.keys(groupedMenu);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const category of categories) {
        const element = categoryRefs.current[category];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      window.scrollTo({ top: element.offsetTop - 120, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen pb-20 bg-black relative overflow-hidden">
      <BackgroundPaths />

      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-black opacity-70 pointer-events-none" />

      {/* Header */}
      <div className="relative h-64 md:h-80 w-full z-0">
        <img src={vendor.image_url} alt={vendor.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

        <div className="absolute top-6 left-6">
          <Link href="/vendors">
            <Button variant="secondary" size="icon" className="rounded-full bg-background/50 backdrop-blur-md">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">

        {/* Vendor Info */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">{vendor.name}</h1>
          <div className="flex gap-4 text-white/60 mt-2">
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{vendor.location_in_court}</span>
            <span className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {avgRating > 0 ? avgRating.toFixed(1) : "No reviews"}
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="sticky top-0 bg-black/80 backdrop-blur px-4 py-3 flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === category ? 'bg-white text-black' : 'text-white/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Menu */}
        <div className="space-y-10 mt-6">
          {Object.keys(groupedMenu).length === 0 ? (
            <p className="text-white/40">No menu items available.</p>
          ) : (
            (Object.entries(groupedMenu) as [string, any[]][]).map(([category, items]) => (
              <div key={category} ref={(el) => { categoryRefs.current[category] = el; }}>
                <h3 className="text-xl text-white mb-4">{category}</h3>

                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <VegIndicator value={item.is_veg} />
                      <span className="text-white">{item.name}</span>
                    </div>
                    <span className="text-white">₹{item.price}</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-xl text-white mb-4">Reviews</h2>
          <ReviewForm vendorId={vendor.id} />

          {reviews.map((r: any) => (
            <div key={r.id} className="mt-4 p-4 bg-white/5 rounded">
              <p className="text-white">{r.reviewer_name}</p>
              <p className="text-white/50">{r.review_text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}