'use client';

import React from 'react';

interface DiyaProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

export function DiwaliDiya({ className = '', size = 22, showGlow = true }: DiyaProps) {
  return (
    <span
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      title="Happy Diwali from Java Bites! 🪔"
      aria-label="Festive Diwali Diya"
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Flame outer glow */}
          <radialGradient
            id="diya-glow"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </radialGradient>

          {/* Diya Clay Base Gradient */}
          <linearGradient
            id="diya-clay"
            x1="2"
            y1="13"
            x2="22"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Flame Core Gradient */}
          <linearGradient
            id="flame-core"
            x1="12"
            y1="2"
            x2="12"
            y2="13"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="85%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          <filter id="flame-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Halo Glow */}
        {showGlow && (
          <circle
            cx="12"
            cy="8"
            r="7"
            fill="url(#diya-glow)"
            className="animate-pulse opacity-70"
          />
        )}

        {/* Diya Clay Base */}
        <path
          d="M3 13.5C3 13.5 5 20.5 12 20.5C19 20.5 21 13.5 21 13.5C21 13.5 18 16 12 16C6 16 3 13.5 3 13.5Z"
          fill="url(#diya-clay)"
          stroke="#F59E0B"
          strokeWidth="0.8"
        />

        {/* Diya Rim Gold Accent */}
        <path
          d="M3.5 13.6C6.5 15.5 17.5 15.5 20.5 13.6"
          stroke="#FDE047"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Flickering Flame */}
        <g className="diwali-flame origin-[12px_13px]">
          <path
            d="M12 2C10.2 5.5 9 8 9 10.5C9 12.2 10.3 13.5 12 13.5C13.7 13.5 15 12.2 15 10.5C15 8 13.8 5.5 12 2Z"
            fill="url(#flame-core)"
            filter="url(#flame-blur)"
          />
          {/* Inner bright core */}
          <ellipse
            cx="12"
            cy="10"
            rx="1.3"
            ry="2.2"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </g>
      </svg>
      <style jsx>{`
        @keyframes flameWiggle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.06, 0.96) rotate(-2deg);
          }
          50% {
            transform: scale(0.97, 1.04) rotate(1.5deg);
          }
          75% {
            transform: scale(1.03, 0.98) rotate(-1deg);
          }
        }
        .diwali-flame {
          animation: flameWiggle 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .diwali-flame {
            animation: none !important;
          }
        }
      `}</style>
    </span>
  );
}

