'use client';

import React, { useSyncExternalStore } from 'react';
import { X, Sparkles } from 'lucide-react';
import { DiwaliDiya } from './diwali-diya';

interface DiwaliBannerProps {
  remainingMs?: number;
}

const STORAGE_KEY = 'diwali-banner-dismissed';
let bannerListeners: Array<() => void> = [];

function subscribeBanner(callback: () => void) {
  bannerListeners.push(callback);
  window.addEventListener('storage', callback);
  return () => {
    bannerListeners = bannerListeners.filter((cb) => cb !== callback);
    window.removeEventListener('storage', callback);
  };
}

function getBannerSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  return sessionStorage.getItem(STORAGE_KEY) === 'true';
}

function getBannerServerSnapshot(): boolean {
  return true;
}

export function DiwaliBanner({ remainingMs }: DiwaliBannerProps) {
  const isDismissed = useSyncExternalStore(
    subscribeBanner,
    getBannerSnapshot,
    getBannerServerSnapshot
  );

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    bannerListeners.forEach((cb) => cb());
  };

  if (isDismissed) return null;

  // Format hours remaining if less than 30 hours
  let timeNote = '';
  if (remainingMs && remainingMs > 0) {
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    if (hours > 0) {
      timeNote = `${hours}h left in celebration`;
    }
  }

  return (
    <aside
      aria-label="Diwali Celebration Announcement"
      className="relative z-40 w-full border-b border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-orange-950/20 to-amber-950/30 backdrop-blur-sm dark:from-amber-950/50 dark:via-orange-950/40 dark:to-amber-950/50 text-foreground transition-all duration-300"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <div className="flex flex-1 items-center justify-center gap-2 sm:gap-3 text-center pr-6">
          <DiwaliDiya size={18} showGlow={false} className="shrink-0" />
          <p className="text-xs sm:text-sm font-medium tracking-wide text-amber-800 dark:text-amber-200">
            <span className="font-semibold text-amber-900 dark:text-amber-100">
              Happy Diwali from Java Bites!
            </span>{' '}
            <span className="hidden md:inline text-amber-700/80 dark:text-amber-300/80">
              Wishing you light, joy, and delicious moments.
            </span>
            {timeNote && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
                {timeNote}
              </span>
            )}
          </p>
          <Sparkles className="hidden sm:inline-block h-3.5 w-3.5 text-amber-400/80" />
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-md p-1 text-amber-700/70 hover:text-amber-900 hover:bg-amber-500/10 dark:text-amber-300/70 dark:hover:text-amber-100 dark:hover:bg-amber-400/10 transition-colors"
          aria-label="Dismiss Diwali banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}
