'use client';

import { useSyncExternalStore } from 'react';
import { getDiwaliStatus, type DiwaliStatusInfo } from '@/lib/diwali';

let cachedSnapshot: DiwaliStatusInfo | null = null;
let lastSnapshotTime = 0;

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Periodic check every 15 seconds to ensure boundary transitions trigger immediately
  const interval = setInterval(callback, 15_000);
  window.addEventListener('focus', callback);
  window.addEventListener('online', callback);

  return () => {
    clearInterval(interval);
    window.removeEventListener('focus', callback);
    window.removeEventListener('online', callback);
  };
}

function getSnapshot(): DiwaliStatusInfo {
  const now = Date.now();
  // Cache for 1 second to maintain referential stability within single render ticks
  if (!cachedSnapshot || now - lastSnapshotTime > 1000) {
    cachedSnapshot = getDiwaliStatus(now);
    lastSnapshotTime = now;
  }
  return cachedSnapshot;
}

const SERVER_SNAPSHOT: DiwaliStatusInfo = {
  isActive: false,
  status: 'upcoming',
  startMs: null,
  endMs: null,
  remainingMs: 0,
  elapsedMs: 0,
  totalDurationMs: 30 * 60 * 60 * 1000,
};

function getServerSnapshot(): DiwaliStatusInfo {
  return SERVER_SNAPSHOT;
}

export function useDiwali() {
  const status = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // When rendered on client, status will match client snapshot; on server it uses SERVER_SNAPSHOT
  const isMounted = typeof window !== 'undefined';

  return {
    ...status,
    isMounted,
  };
}
