'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Star, MapPin, Phone, Clock, Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ReviewForm } from './review-form';
import { VegIndicator } from '@/components/ui/veg-indicator';
import Image from 'next/image';
import { isVeg } from '@/lib/utils';

export function VendorDetailClient({ vendor, menuItems, reviews }: any) {
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [dietFilter, setDietFilter] = useState<string>("all");
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const fallbackImage = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop';
  const [imgSrc, setImgSrc] = useState(vendor.image_url || fallbackImage);

  useEffect(() => {
    setImgSrc(vendor.image_url || fallbackImage);
  }, [vendor.image_url]);

  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  // Group menu items by category and apply filters + client-side menu search
  const groupedMenu = useMemo(() => {
    let filteredItems = menuItems;

    // Menu search filter
    if (menuSearchQuery.trim()) {
      const q = menuSearchQuery.toLowerCase().trim();
      filteredItems = filteredItems.filter((item: any) =>
        item.name.toLowerCase().includes(q)
      );
    }

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
  }, [menuItems, budgetFilter, dietFilter, menuSearchQuery]);

  const categories = Object.keys(groupedMenu);

  useEffect(() => {
    if (categories.length > 0 && (!activeCategory || !categories.includes(activeCategory))) {
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
    <main className="relative min-h-screen overflow-hidden bg-background pb-20 text-foreground">

      {/* Header Image */}
      <div className="relative z-0 h-56 w-full sm:h-64 md:h-80">
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
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-5xl px-5 sm:px-6">
        {/* Minimal Back Arrow */}
        <Link 
          href="/vendors"
          aria-label="Go back to vendors"
          className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Vendor Info */}
        <div className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{vendor.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" strokeWidth={1.5} />{vendor.location_in_court}</span>
            <span className="flex items-center gap-2 text-primary">
              <Star className="h-4 w-4 fill-current" strokeWidth={1.5} />
              {avgRating > 0 ? avgRating.toFixed(1) : "No reviews"}
            </span>
            <span className="flex items-center gap-2 text-secondary-foreground">
              <Clock className="h-4 w-4" strokeWidth={1.5} />
              9:00 AM – 11:00 PM
            </span>
            {vendor.phone_number && (
              <a 
                href={`tel:${vendor.phone_number}`}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                {vendor.phone_number}
              </a>
            )}
          </div>
        </div>

        {/* Menu Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={menuSearchQuery}
            onChange={(e) => setMenuSearchQuery(e.target.value)}
            placeholder="Search menu"
            className="h-12 rounded-xl border-border bg-card pl-11 pr-12 text-foreground placeholder:text-muted-foreground"
          />
          {menuSearchQuery && (
            <button
              onClick={() => setMenuSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-6 border-y border-border py-5">
          {/* Budget Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Budget</span>
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
                    className={`shrink-0 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                      isActive
                        ? 'border-primary bg-primary/15 text-primary font-medium'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
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
            <span className="text-xs text-muted-foreground">Diet</span>
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
                    className={`shrink-0 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                      isActive
                        ? 'border-primary bg-primary/15 text-primary font-medium'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
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
          <div className="sticky top-16 z-20 -mx-5 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-5 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 scrollbar-none">
            {categories.map(category => (
              <button
                key={category}
                ref={el => { tabRefs.current[category] = el; }}
                onClick={() => scrollToCategory(category)}
                className={`shrink-0 rounded-lg border px-4 py-2 text-sm transition-colors ${
                  activeCategory === category 
                    ? 'border-primary bg-primary text-primary-foreground font-medium'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
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
            <div className="text-center py-12 px-4 rounded-xl border border-border bg-card/30">
              <p className="text-muted-foreground">
                {menuSearchQuery.trim()
                  ? `No menu items found for "${menuSearchQuery}".`
                  : 'No menu items available for this filter.'}
              </p>
            </div>
          ) : (
            (Object.entries(groupedMenu) as [string, any[]][]).map(([category, items]) => (
              <div key={category} ref={(el) => { categoryRefs.current[category] = el; }}>
                <h3 className="mb-3 text-xl font-medium text-foreground">{category}</h3>
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  {items.map(item => (
                    <div key={item.id} className="flex min-h-14 items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <VegIndicator value={item.is_veg} />
                        <span className="truncate text-foreground">{item.name}</span>
                      </div>
                      <span className="shrink-0 font-medium tabular-nums text-foreground">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reviews */}
        <div className="mt-12 relative z-10">
          <h2 className="mb-4 text-xl font-medium text-foreground">Reviews</h2>
          <ReviewForm vendorId={vendor.id} vendorSlug={vendor.slug} />

          {reviews.map((r: any) => (
            <div key={r.id} className="mt-4 rounded-xl border border-border bg-card p-4">
              <p className="text-foreground font-medium">{r.reviewer_name}</p>
              <p className="text-muted-foreground text-sm mt-1">{r.review_text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
