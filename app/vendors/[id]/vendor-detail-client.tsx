'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReviewForm } from './review-form';
import { BackgroundPaths } from '@/components/ui/background-paths';

export function VendorDetailClient({ vendor, menuItems, reviews }: any) {
  const [budget, setBudget] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum: any, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  // Group menu items by category
  const groupedMenu = useMemo(() => {
    const grouped = menuItems.reduce((acc: any, item: any) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, any[]>);
    
    const categoriesList = Object.keys(grouped);
    if (categoriesList.length > 0 && !activeCategory) {
      setActiveCategory(categoriesList[0]);
    }
    return grouped;
  }, [menuItems]);

  const categories = useMemo(() => Object.keys(groupedMenu), [groupedMenu]);

  // Handle scroll to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for sticky header

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
      const offset = element.offsetTop - 120; // Offset for sticky bar
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen pb-20 bg-black relative overflow-hidden">
      {/* Animated path lines */}
      <BackgroundPaths />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-black opacity-70 pointer-events-none" />

      {/* Header Banner */}
      <div className="relative h-64 md:h-80 w-full z-0">
        <img 
          src={vendor.image_url} 
          alt={vendor.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        
        <div className="absolute top-6 left-6">
          <Link href="/vendors">
            <Button variant="secondary" size="icon" className="rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80 border-0">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white">{vendor.name}</h1>
              <Badge variant={vendor.is_open ? 'default' : 'secondary'} className={vendor.is_open ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}>
                {vendor.is_open ? 'Open' : 'Closed'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-white/40 mb-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {vendor.location_in_court}
              </span>
              <span className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 fill-current mr-1" /> 
                {avgRating > 0 ? `${avgRating.toFixed(1)} (${reviews.length} reviews)` : 'No reviews'}
              </span>
              <Badge variant="outline" className="border-white/[0.1] text-white/60">{vendor.cuisine_type}</Badge>
            </div>
            <p className="text-lg text-white/70 max-w-2xl">{vendor.description}</p>
          </div>
        </div>

        {/* Feature 3: Sticky Category Bar */}
        {categories.length > 0 && (
          <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08] -mx-6 px-6 mb-8 py-4 overflow-x-auto no-scrollbar flex items-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-4 mb-6">
              <h2 className="text-2xl font-semibold text-white">Menu</h2>
              <div className="flex gap-2">
                {["All", "Under ₹100", "Under ₹150"].map((label, i) => {
                  const value = i === 1 ? 100 : i === 2 ? 150 : null;
                  const isActive = budget === value;
                  return (
                    <button
                      key={label}
                      onClick={() => setBudget(value)}
                      className={`px-3 py-1 rounded-full border text-xs transition-all ${
                        isActive
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {Object.keys(groupedMenu).length === 0 ? (
              <p className="text-white/40 italic">No menu items available.</p>
            ) : (
              Object.entries(groupedMenu).map(([category, items]) => (
                <div 
                  key={category} 
                  ref={(el) => { categoryRefs.current[category] = el; }}
                  className="scroll-mt-32"
                >
                  <h3 className="text-xl font-medium mb-4 text-white/90">{category}</h3>
                  <div className="space-y-4 mb-10">
                    {(items as any[]).map(item => (
                      <div key={item.id} className={`flex justify-between items-center p-4 rounded-xl border transition-all group ${
                        budget && item.price > budget ? 'opacity-30' : 'bg-white/[0.03] border-white/[0.08] hover:bg-neutral-900'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full shrink-0 ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white text-lg">{item.name}</span>
                              {budget && item.price <= budget && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] px-1.5 py-0 uppercase tracking-wider font-bold">
                                  Budget
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-white/80 font-bold text-lg">₹{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reviews Section */}
          <div className="space-y-8">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">Write a Review</h2>
              <ReviewForm vendorId={vendor.id} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">Recent Reviews</h2>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-white/40 italic">Be the first to review!</p>
                ) : (
                  reviews.map((review: any) => (
                    <Card key={review.id} className="border-white/[0.08] bg-white/[0.02]">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-white/90">{review.reviewer_name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-white/50 text-sm">{review.review_text}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

