'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ui/theme-toggle';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo / Wordmark */}
        <Link 
          href="/" 
          className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground hover:opacity-90 transition-opacity"
        >
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Java Bites
          </span>
        </Link>

        {/* Right: Vendors Link */}
        <div className="flex items-center gap-6">
          <Link
            href="/vendors"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname.startsWith('/vendors') ? 'text-foreground font-semibold' : 'text-muted-foreground'
            }`}
          >
            Vendors
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
