'use client';

import { useState, useMemo, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { Search, Store, ArrowRight, Loader2 } from 'lucide-react';
import { VegIndicator } from './ui/veg-indicator';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  is_veg?: any;
}

interface Vendor {
  id: string;
  slug?: string;
  name: string;
  cuisine_type?: string;
  location_in_court?: string;
  is_open?: boolean;
  menu_items?: MenuItem[];
}

interface GlobalSearchProps {
  vendors: Vendor[];
}

interface SearchItem {
  id: string;
  type: 'vendor' | 'dish';
  name: string;
  vendorName: string;
  vendorSlug: string;
  cuisine?: string;
  location?: string;
  price?: number;
  category?: string;
  isVeg?: boolean;
}

export function GlobalSearch({ vendors }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Flatten vendors and menu items into a searchable index
  const searchIndex = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];

    vendors.forEach((vendor) => {
      const slug = vendor.slug || vendor.id;

      // 1. Add Vendor entry
      items.push({
        id: `vendor-${vendor.id}`,
        type: 'vendor',
        name: vendor.name,
        vendorName: vendor.name,
        vendorSlug: slug,
        cuisine: vendor.cuisine_type,
        location: vendor.location_in_court,
      });

      // 2. Add Dish entries from vendor's menu
      if (vendor.menu_items && vendor.menu_items.length > 0) {
        vendor.menu_items.forEach((dish) => {
          items.push({
            id: `dish-${vendor.id}-${dish.id || dish.name}`,
            type: 'dish',
            name: dish.name,
            vendorName: vendor.name,
            vendorSlug: slug,
            price: dish.price,
            category: dish.category,
            isVeg: dish.is_veg,
            cuisine: vendor.cuisine_type,
          });
        });
      }
    });

    return items;
  }, [vendors]);

  // Configure Fuse.js for fuzzy matching
  const fuse = useMemo(() => {
    return new Fuse(searchIndex, {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'vendorName', weight: 0.3 },
        { name: 'cuisine', weight: 0.2 },
        { name: 'category', weight: 0.1 },
      ],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [searchIndex]);

  // Dynamic search results
  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];
    return fuse.search(trimmed).slice(0, 8).map((res) => res.item);
  }, [query, fuse]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchItem) => {
    setPendingId(item.id);
    startTransition(() => {
      router.push(`/vendors/${item.vendorSlug}`);
    });
  };

  const handleViewAll = () => {
    setPendingId('view-all');
    startTransition(() => {
      router.push(`/vendors?search=${encodeURIComponent(query.trim())}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      handleViewAll();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-30">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search vendors or dishes..."
          className="w-full pl-12 pr-4 h-14 bg-secondary/80 hover:bg-secondary focus:bg-secondary border border-border focus:border-primary/50 text-foreground placeholder:text-muted-foreground text-base rounded-2xl shadow-lg shadow-black/20 outline-none transition-all duration-200"
        />
      </div>

      {/* Popover Results */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          {results.length > 0 ? (
            <div className="py-2 divide-y divide-border/50">
              <div className="max-h-[360px] overflow-y-auto">
                {results.map((item) => {
                  const isItemPending = isPending && pendingId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      disabled={isPending}
                      className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between gap-3 group ${
                        isItemPending ? 'bg-accent/80 text-primary' : 'hover:bg-accent/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.type === 'dish' ? (
                          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                            <VegIndicator value={item.isVeg} />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
                            <Store className="w-4 h-4" />
                          </div>
                        )}

                        <div className="min-w-0">
                          {item.type === 'dish' ? (
                            <>
                              <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {item.name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {item.vendorName} {item.price ? `· ₹${item.price}` : ''}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {item.name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {item.cuisine} {item.location ? `· ${item.location}` : ''}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {isItemPending ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* View all results footer */}
              <button
                type="button"
                onClick={handleViewAll}
                disabled={isPending}
                className="w-full text-left px-4 py-2.5 bg-accent/30 hover:bg-accent/70 text-xs font-medium text-primary flex items-center justify-between transition-colors"
              >
                <span>View all results for &ldquo;{query.trim()}&rdquo; →</span>
                {isPending && pendingId === 'view-all' ? (
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No matching vendors or dishes found for &ldquo;{query.trim()}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
