'use client';

import React from 'react';
import { useDiwali } from './use-diwali';
import { DiwaliBanner } from './diwali-banner';
import { DiwaliFireworks } from './diwali-fireworks';
import { DiwaliSparkles } from './diwali-sparkles';

export function DiwaliCelebration() {
  const { isActive, isMounted, remainingMs } = useDiwali();

  // If unmounted (SSR / initial hydration) or not active, render nothing
  if (!isMounted || !isActive) {
    return null;
  }

  return (
    <>
      {/* Subtle Diwali Announcement Banner */}
      <DiwaliBanner remainingMs={remainingMs} />

      {/* Occasional subtle background sparkles */}
      <DiwaliSparkles />

      {/* Click-triggered mini fireworks on interactive elements */}
      <DiwaliFireworks />
    </>
  );
}

