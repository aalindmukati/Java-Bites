'use client';

import React from 'react';

// Fixed subtle sparkle coordinates spread across the viewport
const SPARKLE_POINTS = [
  { top: '12%', left: '8%', delay: '0s', duration: '5.2s', size: 10 },
  { top: '24%', right: '11%', delay: '1.4s', duration: '6.1s', size: 13 },
  { top: '48%', left: '5%', delay: '2.8s', duration: '5.8s', size: 9 },
  { top: '65%', right: '7%', delay: '0.8s', duration: '6.5s', size: 12 },
  { top: '82%', left: '14%', delay: '3.5s', duration: '5.4s', size: 11 },
  { top: '38%', right: '16%', delay: '2.1s', duration: '7.0s', size: 8 },
];

export function DiwaliSparkles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {SPARKLE_POINTS.map((s, idx) => (
        <span
          key={idx}
          className="diwali-bg-sparkle absolute"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          <svg
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill="none"
            className="text-amber-400 dark:text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
          >
            <path
              d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"
              fill="currentColor"
            />
          </svg>
        </span>
      ))}

      <style jsx>{`
        @keyframes subtleTwinkle {
          0%, 100% {
            opacity: 0.08;
            transform: scale(0.7) rotate(0deg);
          }
          50% {
            opacity: 0.35;
            transform: scale(1.1) rotate(45deg);
          }
        }
        .diwali-bg-sparkle {
          animation: subtleTwinkle ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .diwali-bg-sparkle {
            animation: none !important;
            opacity: 0.12 !important;
          }
        }
      `}</style>
    </div>
  );
}

