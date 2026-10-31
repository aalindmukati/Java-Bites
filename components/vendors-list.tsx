'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { VendorCard } from './vendor-card';
import { Input } from './ui/input';
import { Search, ChevronDown, UtensilsCrossed } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { isVeg } from '@/lib/utils';

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
  const [visibleCount, setVisibleCount] = useState(10);
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
    return vendors.filter((vendor) => {
      // Search
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

      const searchMatch = !lower || nameMatch || itemMatch;

      return searchMatch && cuisineMatch && budgetMatch && vegMatch;
    });
  }, [vendors, debouncedQuery, cuisineFilter, budgetFilter, vegFilter]);

  // Performance: Slice for lazy loading
  const visibleVendors = useMemo(() => {
    return filteredVendors.slice(0, visibleCount);
  }, [filteredVendors, visibleCount]);

  return (
    <div className="bg-background text-foreground">
      <div>
        
        {/* Search + Filter */}
        <section className="border-b border-border px-5 pb-6 pt-8 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative max-w-2xl flex-1 flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search vendors, menu items, or categories"
                  className="h-12 rounded-xl border-border bg-card pl-12 text-base placeholder:text-muted-foreground focus-visible:ring-primary/30"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={!cuisineFilter ? 'default' : 'outline'}
                  onClick={() => setCuisineFilter("")}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
                      !cuisineFilter
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  All Cuisines
                </Badge>
                {uniqueCuisines.map(c => (
                  <Badge
                    key={c}
                    variant={cuisineFilter === c ? 'default' : 'outline'}
                    onClick={() => setCuisineFilter(c)}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
                      cuisineFilter === c
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {c}
                  </Badge>
                ))}
              </div>

              <div className="hidden h-8 w-px bg-border md:block" />

              <div className="flex flex-wrap items-center gap-6">
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
                          className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                            isActive
                              ? 'border-primary bg-primary/15 text-primary'
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
                      const isActive = vegFilter === item.value;
                      return (
                        <button
                          key={item.value}
                          onClick={() => setVegFilter(item.value)}
                          className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                            isActive
                              ? 'border-primary bg-primary/15 text-primary'
                              : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Today's Mess Action */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">Dining</span>
                  <div>
                    <Link
                      href="/mess"
                      className="flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                    >
                      <UtensilsCrossed className="h-4 w-4" strokeWidth={1.5} /> Today&apos;s Mess
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vendor Grid */}
        <section className="px-5 py-10 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-medium tracking-tight text-foreground">
                  {searchQuery || cuisineFilter || budgetFilter !== "all" || vegFilter !== "all" ? 'Search Results' : 'All Vendors'}
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
              <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
                <p className="text-lg text-foreground">No vendors match those filters</p>
                <p className="mt-2 text-sm text-muted-foreground">Try clearing a filter or searching for a different dish</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleVendors.map(vendor => (
                    <VendorCard key={vendor.id} vendor={vendor} avgRating={vendor.avgRating || 0} />
                  ))}
                </div>
                
                {/* Load More Button */}
                {visibleCount < filteredVendors.length && (
                  <div className="mt-12 flex justify-center">
                    <Button 
                      onClick={() => setVisibleCount(prev => prev + 10)}
                      variant="outline" 
                      className="h-11 rounded-lg border-border bg-card px-5 text-foreground hover:bg-secondary"
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
