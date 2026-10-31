'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ui/theme-toggle';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Logo / Wordmark */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.png"
            alt="Java Bites Logo"
            width={28}
            height={28}
            className="rounded-lg object-contain shrink-0"
            priority
          />
          <span>Java Bites</span>
        </Link>

        {/* Right: Vendors Link */}
        <div className="flex items-center gap-5">
          <Link
            href="/vendors"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname.startsWith('/vendors') ? 'text-foreground' : 'text-muted-foreground'
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
