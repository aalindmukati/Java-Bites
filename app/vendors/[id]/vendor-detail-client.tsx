'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, ArrowLeft, Phone, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReviewForm } from './review-form';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { VegIndicator } from '@/components/ui/veg-indicator';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { isVeg } from '@/lib/utils';

export function VendorDetailClient({ vendor, menuItems, reviews }: any) {
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [dietFilter, setDietFilter] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const fallbackImage = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop';
  const [imgSrc, setImgSrc] = useState(vendor.image_url || fallbackImage);

  useEffect(() => {
    setImgSrc(vendor.image_url || fallbackImage);
  }, [vendor.image_url]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  // Group menu items by category
  const groupedMenu = useMemo(() => {
    let filteredItems = menuItems;
    if (budgetFilter === "under50") {
      filteredItems = filteredItems.filter((item: any) => item.price <= 50);
    } else if (budgetFilter === "under100") {
      filteredItems = filteredItems.filter((item: any) => item.price <= 100);
    } else if (budgetFilter === "under150") {
      filteredItems = filteredItems.filter((item: any) => item.price <= 150);
    } else if (budgetFilter === "above150") {
      filteredItems = filteredItems.filter((item: any) => item.price > 150);
    }

    if (dietFilter === "veg") {
      filteredItems = filteredItems.filter((item: any) => isVeg(item.is_veg));
    } else if (dietFilter === "nonveg") {
      filteredItems = filteredItems.filter((item: any) => !isVeg(item.is_veg));
    }

    const grouped = filteredItems.reduce((acc: Record<string, any[]>, item: any) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
    return grouped;
  }, [menuItems, budgetFilter, dietFilter]);

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

  // Tab auto-scroll
  useEffect(() => {
    if (activeCategory) {
      const activeTabElement = tabRefs.current[activeCategory];
      if (activeTabElement) {
        const container = activeTabElement.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const tabWidth = activeTabElement.clientWidth;
          const containerRect = container.getBoundingClientRect();
          const tabRect = activeTabElement.getBoundingClientRect();
          const scrollLeftOffset = tabRect.left - containerRect.left + container.scrollLeft;

          container.scrollTo({
            left: scrollLeftOffset - (containerWidth / 2) + (tabWidth / 2),
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeCategory]);

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      window.scrollTo({ top: element.offsetTop - 120, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen pb-20 bg-background text-foreground relative overflow-hidden transition-colors duration-300">
      {!isMobile && <BackgroundPaths />}

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background opacity-80 pointer-events-none" />

      {/* Header */}
      <div className="relative h-64 md:h-80 w-full z-0">
        <Image 
          src={imgSrc} 
          alt={vendor.name} 
          fill
          priority
          sizes="100vw"
          className="object-cover" 
          onError={() => {
            setImgSrc(fallbackImage);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

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
          <h1 className="text-4xl font-bold text-foreground">{vendor.name}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground mt-2 items-center text-sm">
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{vendor.location_in_court}</span>
            <span className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {avgRating > 0 ? avgRating.toFixed(1) : "No reviews"}
            </span>
            <span className="flex items-center text-foreground">
              <Clock className="w-4 h-4 mr-1" />
              9:00 AM – 11:00 PM
            </span>
            {vendor.phone_number && (
              <a 
                href={`tel:${vendor.phone_number}`}
                className="flex items-center hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4 mr-1" />
                {vendor.phone_number}
              </a>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 mt-8 mb-6 items-center border-t border-b border-border py-4">
          {/* Budget Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Budget</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Under ₹50", value: "under50" },
                { label: "Under ₹100", value: "under100" },
                { label: "Under ₹150", value: "under150" },
                { label: "Above ₹150", value: "above150" }
              ].map((item) => {
                const isActive = budgetFilter === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setBudgetFilter(item.value)}
                    className={`px-3 py-1.5 rounded-full border text-xs transition-all shrink-0 ${
                      isActive
                        ? 'bg-green-500/20 border-green-500/50 text-green-500 dark:text-green-400 font-medium'
                        : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diet Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Diet</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Veg", value: "veg" },
                { label: "Non-Veg", value: "nonveg" }
              ].map((item) => {
                const isActive = dietFilter === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setDietFilter(item.value)}
                    className={`px-3 py-1.5 rounded-full border text-xs transition-all shrink-0 ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 dark:text-amber-400 font-medium'
                        : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="sticky top-0 bg-background/80 backdrop-blur px-4 py-3 flex gap-2 overflow-x-auto z-20 border-b border-border scrollbar-none">
            {categories.map(category => (
              <button
                key={category}
                ref={el => { tabRefs.current[category] = el; }}
                onClick={() => scrollToCategory(category)}
                className={`px-4 py-2 rounded-full border text-sm transition-all shrink-0 ${
                  activeCategory === category 
                    ? 'bg-foreground text-background border-foreground font-medium' 
                    : 'bg-secondary/50 text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Menu */}
        <div className="space-y-10 mt-6 relative z-10">
          {Object.keys(groupedMenu).length === 0 ? (
            <p className="text-muted-foreground">No menu items available for this filter.</p>
          ) : (
            <AnimatePresence mode="popLayout">
              {(Object.entries(groupedMenu) as [string, any[]][]).map(([category, items]) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  key={category} 
                  ref={(el) => { categoryRefs.current[category] = el; }}
                >
                  <h3 className="text-xl text-foreground mb-4">{category}</h3>

                  <AnimatePresence mode="popLayout">
                    {items.map(item => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        key={item.id} 
                        className="flex justify-between items-center p-3 border-b border-border overflow-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <VegIndicator value={item.is_veg} />
                          <span className="text-foreground">{item.name}</span>
                        </div>
                        <span className="text-foreground font-medium">₹{item.price}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-12 relative z-10">
          <h2 className="text-xl text-foreground mb-4">Reviews</h2>
          <ReviewForm vendorId={vendor.id} />

          {reviews.map((r: any) => (
            <div key={r.id} className="mt-4 p-4 bg-secondary border border-border rounded-xl">
              <p className="text-foreground font-medium">{r.reviewer_name}</p>
              <p className="text-muted-foreground text-sm mt-1">{r.review_text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}