'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { VendorCard } from './vendor-card';
import { Input } from './ui/input';
import { Search, ChevronDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { BackgroundPaths } from './ui/background-paths';
import { Button } from './ui/button';
import { isVeg, isOpen } from '@/lib/utils';

interface MenuItem {
  name: string;
  price: number;
  category: string;
  is_veg?: any;
}

interface Vendor {
  id: string;
  slug?: string;
  name: string;
  description: string;
  cuisine_type: string;
  location_in_court: string;
  is_open: boolean;
  image_url: string;
  menu_items?: MenuItem[];
  avgRating?: number;
  reviewCount?: number;
}

interface VendorsListProps {
  vendors: Vendor[];
  uniqueCuisines: string[];
}

export function VendorsList({ vendors, uniqueCuisines }: VendorsListProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [vegFilter, setVegFilter] = useState<string>("all");
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [sortByRating, setSortByRating] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(10); // Reset visible count on search
  };

  const filteredVendors = useMemo(() => {
    const lower = debouncedQuery.toLowerCase().trim();
    let result = vendors.filter((vendor) => {
      // Feature 1: Smart Search
      const nameMatch = vendor.name.toLowerCase().includes(lower);
      
      const itemMatch = vendor.menu_items?.some((item) =>
        item.name.toLowerCase().includes(lower) || 
        item.category.toLowerCase().includes(lower)
      );

      const cuisineMatch = cuisineFilter ? vendor.cuisine_type === cuisineFilter : true;

      // Budget filter logic
      const budgetMatch = (() => {
        if (budgetFilter === "all") return true;
        if (budgetFilter === "under50") return vendor.menu_items?.some(item => item.price <= 50);
        if (budgetFilter === "under100") return vendor.menu_items?.some(item => item.price <= 100);
        if (budgetFilter === "under150") return vendor.menu_items?.some(item => item.price <= 150);
        if (budgetFilter === "above150") return vendor.menu_items?.some(item => item.price > 150);
        return true;
      })();

      // Veg/Non-Veg filter logic
      const vegMatch = (() => {
        if (vegFilter === "all") return true;
        if (vegFilter === "veg") return vendor.menu_items?.some(item => isVeg(item.is_veg));
        if (vegFilter === "nonveg") return vendor.menu_items?.some(item => !isVeg(item.is_veg));
        return true;
      })();

      // Open Now filter logic
      const openMatch = !openFilter || isOpen(vendor.name, vendor.is_open);

      // Return vendors where name matches OR at least one menu item/category matches
      const searchMatch = !lower || nameMatch || itemMatch;

      return searchMatch && cuisineMatch && budgetMatch && vegMatch && openMatch;
    });

    if (sortByRating) {
      result = [...result].sort((a, b) => ((b as any).avgRating || 0) - ((a as any).avgRating || 0));
    }

    return result;
  }, [vendors, debouncedQuery, cuisineFilter, budgetFilter, vegFilter, openFilter, sortByRating]);

  // Performance: Slice for lazy loading
  const visibleVendors = useMemo(() => {
    return filteredVendors.slice(0, visibleCount);
  }, [filteredVendors, visibleCount]);


  const trendingVendors = vendors.slice(0, 5);

  return (
    <div className="relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Feature 2: Disable heavy animations on mobile */}
      {!isMobile && <BackgroundPaths />}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-black opacity-70 pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10">
        
        {/* Search + Filter */}
        <section className="px-6 pt-12 pb-6 border-b border-border">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative max-w-2xl flex-1 flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-white/40" />
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search vendors, menu items, or categories..."
                  className="pl-12 h-14 text-lg bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-white/20 rounded-full shadow-sm"
                />
              </div>
              
              <button
                onClick={() => setSortByRating(!sortByRating)}
                className={`px-6 h-14 rounded-full border transition-all flex items-center gap-2 font-medium ${
                  sortByRating 
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' 
                    : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
                }`}
              >
                ⭐ Top Rated
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={!cuisineFilter ? 'default' : 'outline'}
                  onClick={() => setCuisineFilter("")}
                  className={`cursor-pointer text-sm py-1.5 px-4 rounded-full transition-colors ${
                    !cuisineFilter
                      ? 'bg-white text-black'
                      : 'bg-transparent text-white/60 border-white/[0.15] hover:border-white/30'
                  }`}
                >
                  All Cuisines
                </Badge>
                {uniqueCuisines.map(c => (
                  <Badge
                    key={c}
                    variant={cuisineFilter === c ? 'default' : 'outline'}
                    onClick={() => setCuisineFilter(c)}
                    className={`cursor-pointer text-sm py-1.5 px-4 rounded-full transition-colors ${
                      cuisineFilter === c
                        ? 'bg-white text-black'
                        : 'bg-transparent text-white/60 border-white/[0.15] hover:border-white/30'
                    }`}
                  >
                    {c}
                  </Badge>
                ))}
              </div>              <div className="h-6 w-px bg-white/10 hidden md:block" />

              <div className="flex flex-wrap items-center gap-6">
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
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-green-500/20 border-green-500/50 text-green-400'
                              : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
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
                      const isActive = vegFilter === item.value;
                      return (
                        <button
                          key={item.value}
                          onClick={() => setVegFilter(item.value)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                              : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Open Now Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Status</span>
                  <div>
                    <button
                      onClick={() => setOpenFilter(!openFilter)}
                      className={`px-4 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 ${
                        openFilter
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${openFilter ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`} />
                      Open Now
                    </button>
                  </div>
                </div>

                {/* Today's Mess Action */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Dining</span>
                  <div>
                    <Link
                      href="/mess"
                      className="px-4 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 bg-amber-500/20 border-amber-500/50 text-amber-500 hover:bg-amber-500/30 dark:bg-amber-500/25 dark:border-amber-500/40 dark:text-amber-400 cursor-pointer"
                    >
                      🍽 Today's Mess
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        {!searchQuery && !cuisineFilter && budgetFilter === "all" && vegFilter === "all" && !openFilter && (
          <section className="px-6 pt-12 pb-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
                🔥 Popular Now
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {trendingVendors.map(vendor => (
                  <VendorCard key={`trending-${vendor.id}`} vendor={vendor} avgRating={vendor.avgRating || 0} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Vendor Grid */}
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {searchQuery || cuisineFilter || budgetFilter !== "all" || vegFilter !== "all" || openFilter ? 'Search Results' : 'All Vendors'}
                </h2>
                {budgetFilter !== "all" && (
                  <p className="text-sm text-muted-foreground">
                    Showing vendors with items {
                      budgetFilter === "under50" ? "under ₹50" :
                      budgetFilter === "under100" ? "under ₹100" :
                      budgetFilter === "under150" ? "under ₹150" :
                      "above ₹150"
                    }
                  </p>
                )}
              </div>
            </div>
            {visibleVendors.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-border bg-card">
                <p className="text-xl text-muted-foreground">No vendors found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleVendors.map(vendor => (
                    <VendorCard key={vendor.id} vendor={vendor} avgRating={vendor.avgRating || 0} />
                  ))}
                </div>
                
                {/* Feature 2: Load More Button */}
                {visibleCount < filteredVendors.length && (
                  <div className="mt-12 flex justify-center">
                    <Button 
                      onClick={() => setVisibleCount(prev => prev + 10)}
                      variant="outline" 
                      className="bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08] rounded-full px-8 py-6 h-auto"
                    >
                      Load More Vendors <ChevronDown className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

