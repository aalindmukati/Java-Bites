'use client';

import { useState, useMemo, useEffect } from 'react';
import { VendorCard } from './vendor-card';
import { Input } from './ui/input';
import { Search, ChevronDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { BackgroundPaths } from './ui/background-paths';
import Loader from './ui/loader';
import { Button } from './ui/button';

interface MenuItem {
  name: string;
  price: number;
  category: string;
  is_veg?: any;
}

interface Vendor {
  id: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [sortByRating, setSortByRating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial load
    const timer = setTimeout(() => setLoading(false), 500);
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
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
      const budgetMatch = !budget || vendor.menu_items?.some(item => item.price <= budget);

      // Return vendors where name matches OR at least one menu item/category matches
      const searchMatch = !lower || nameMatch || itemMatch;

      return searchMatch && cuisineMatch && budgetMatch;
    });

    if (sortByRating) {
      result = [...result].sort((a, b) => ((b as any).avgRating || 0) - ((a as any).avgRating || 0));
    }

    return result;
  }, [vendors, debouncedQuery, cuisineFilter, budget, sortByRating]);

  // Performance: Slice for lazy loading
  const visibleVendors = useMemo(() => {
    return filteredVendors.slice(0, visibleCount);
  }, [filteredVendors, visibleCount]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 py-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.05]"
          />
        ))}
      </div>
    );
  }

  const trendingVendors = vendors.slice(0, 5);

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Feature 2: Disable heavy animations on mobile */}
      {!isMobile && <BackgroundPaths />}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-black opacity-70 pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10">
        
        {/* Search + Filter */}
        <section className="px-6 pt-12 pb-6 border-b border-white/[0.08]">
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
              </div>

              <div className="h-6 w-px bg-white/10 hidden md:block" />

              <div className="flex gap-2">
                {["All", "Under ₹100", "Under ₹150"].map((label, i) => {
                  const value = i === 1 ? 100 : i === 2 ? 150 : null;
                  const isActive = budget === value;

                  return (
                    <button
                      key={label}
                      onClick={() => setBudget(value)}
                      className={`px-4 py-1.5 rounded-full border text-sm transition-all ${
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
          </div>
        </section>

        {/* Trending Section */}
        {!searchQuery && !cuisineFilter && !budget && (
          <section className="px-6 pt-12 pb-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
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
                <h2 className="text-2xl font-bold text-white mb-2">
                  {searchQuery || cuisineFilter || budget ? 'Search Results' : 'All Vendors'}
                </h2>
                {budget && (
                  <p className="text-sm text-white/60">
                    Showing vendors with items under ₹{budget}
                  </p>
                )}
              </div>
            </div>
            {visibleVendors.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <p className="text-xl text-white/40">No vendors found matching your criteria.</p>
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

