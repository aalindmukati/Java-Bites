'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  maxLife: number;
  age: number;
  type: 'spark' | 'star' | 'pop';
  rotation: number;
  rotationSpeed: number;
  popRadius?: number;
}

const GOLDEN_PALETTE = ['#FFD700', '#FBBF24', '#F59E0B', '#FEF08A', '#FDE047'];
const AMBER_PALETTE = ['#D97706', '#B45309', '#F59E0B', '#FCD34D'];
const ORANGE_PALETTE = ['#F97316', '#EA580C', '#FB923C', '#FF7849'];
const RED_PALETTE = ['#EF4444', '#DC2626', '#F87171'];

function pickRandomColor(): string {
  const roll = Math.random();
  if (roll < 0.45) {
    return GOLDEN_PALETTE[Math.floor(Math.random() * GOLDEN_PALETTE.length)];
  } else if (roll < 0.75) {
    return AMBER_PALETTE[Math.floor(Math.random() * AMBER_PALETTE.length)];
  } else if (roll < 0.90) {
    return ORANGE_PALETTE[Math.floor(Math.random() * ORANGE_PALETTE.length)];
  } else {
    // Occasional festive red
    return RED_PALETTE[Math.floor(Math.random() * RED_PALETTE.length)];
  }
}

/**
 * Checks if the click target is an interactive element (button, link, tab, clickable card, logo).
 */
function checkElementInteraction(target: HTMLElement | null): {
  isInteractive: boolean;
  isLogo: boolean;
} {
  if (!target) return { isInteractive: false, isLogo: false };

  // Explicit logo check
  const logoEl = target.closest(
    '[data-diwali-logo="true"], .diwali-logo, a[href="/"]'
  );
  if (logoEl) {
    const text = logoEl.textContent || '';
    const hasLogoImg = logoEl.querySelector('img[alt*="Java Bites"]') !== null;
    if (text.includes('Java Bites') || hasLogoImg || logoEl.hasAttribute('data-diwali-logo')) {
      return { isInteractive: true, isLogo: true };
    }
  }

  // Interactive element detection
  const interactiveEl = target.closest(
    'button, a, [role="button"], [role="link"], [role="tab"], [role="switch"], [role="checkbox"], [role="menuitem"], summary, label, [data-interactive="true"], [data-diwali-burst="true"], .cursor-pointer'
  );

  return {
    isInteractive: !!interactiveEl,
    isLogo: false,
  };
}

/**
 * Ensures clicks inside typing inputs, textareas, or active text selections are ignored.
 */
function shouldIgnoreInteraction(target: HTMLElement | null): boolean {
  if (!target) return true;

  // Form controls & editable fields
  if (
    target.closest(
      'input, textarea, select, [contenteditable="true"], [role="textbox"], [role="searchbox"]'
    )
  ) {
    return true;
  }

  // Active text selection
  if (typeof window !== 'undefined') {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      return true;
    }
  }

  return false;
}

export function DiwaliFireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastBurstTimeRef = useRef<number>(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize, { passive: true });

    const createBurst = (x: number, y: number, isLogo: boolean) => {
      const now = performance.now();
      // Throttle rapid clicks to prevent lag
      if (now - lastBurstTimeRef.current < 60) return;
      lastBurstTimeRef.current = now;

      const particles = particlesRef.current;
      // Cap maximum active particles on screen
      const MAX_ACTIVE_PARTICLES = 130;
      if (particles.length > MAX_ACTIVE_PARTICLES) {
        // Discard oldest particles
        particles.splice(0, particles.length - MAX_ACTIVE_PARTICLES + 25);
      }

      // Determine burst size and properties
      let count: number;
      let speedMultiplier: number;
      let starChance: number;

      if (isLogo) {
        // Grand logo firework
        count = 45 + Math.floor(Math.random() * 15); // 45-60 particles
        speedMultiplier = 1.35;
        starChance = 0.55;
      } else {
        // Most clicks are subtle; occasionally produce a slightly bigger celebration (~18% chance)
        const isBigger = Math.random() < 0.18;
        if (isBigger) {
          count = 26 + Math.floor(Math.random() * 10); // 26-36 particles
          speedMultiplier = 1.15;
          starChance = 0.40;
        } else {
          count = 14 + Math.floor(Math.random() * 8); // 14-22 particles
          speedMultiplier = 0.85;
          starChance = 0.25;
        }
      }

      // Add firecracker-style pop ring
      particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        color: '#FEF08A',
        size: isLogo ? 18 : 12,
        maxLife: 220,
        age: 0,
        type: 'pop',
        rotation: 0,
        rotationSpeed: 0,
        popRadius: 2,
      });

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (1.4 + Math.random() * 3.8) * speedMultiplier;
        const maxLife = 420 + Math.random() * 460; // 420ms - 880ms
        const rollType = Math.random();
        const type: Particle['type'] = rollType < starChance ? 'star' : 'spark';

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isLogo ? 1.0 : 0.4), // slight initial upward lift
          color: pickRandomColor(),
          size: type === 'star' ? 3.5 + Math.random() * 3 : 2 + Math.random() * 2.5,
          maxLife,
          age: 0,
          type,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
        });
      }

      // Start animation loop if not running
      if (!animFrameIdRef.current) {
        lastTimestamp = performance.now();
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      }
    };

    let lastTimestamp = performance.now();

    const renderLoop = (currentTimestamp: number) => {
      const delta = Math.min(currentTimestamp - lastTimestamp, 50); // cap delta to avoid jumps
      lastTimestamp = currentTimestamp;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += delta;

        if (p.age >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.age / p.maxLife;
        const fade = Math.max(0, 1 - progress);

        if (p.type === 'pop') {
          // Firecracker shockwave pop ring
          const radius = (p.popRadius || 2) + progress * (p.size * 1.5);
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - progress) * 0.75;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
          continue;
        }

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95; // air drag
        p.vy = p.vy * 0.95 + 0.08; // air drag + gravity
        p.rotation += p.rotationSpeed;

        const currentSize = Math.max(0.5, p.size * (1 - progress * 0.6));

        ctx.save();
        ctx.globalAlpha = Math.pow(fade, 1.2);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'star') {
          // 4-point sparkle star
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          drawSparkleStar(ctx, currentSize);
        } else {
          // Glowing round spark
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      } else {
        // Stop loop when all particles are done; 0% CPU consumption
        animFrameIdRef.current = null;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (shouldIgnoreInteraction(target)) return;

      const { isInteractive, isLogo } = checkElementInteraction(target);
      if (!isInteractive) return;

      // Determine interaction coordinates
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Fallback for keyboard clicks (Enter / Space) where clientX / clientY might be 0
      if (clientX === 0 && clientY === 0 && target) {
        const rect = target.getBoundingClientRect();
        clientX = rect.left + rect.width / 2;
        clientY = rect.top + rect.height / 2;
      }

      createBurst(clientX, clientY, isLogo);
    };

    // Listen on document for non-blocking clicks
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('resize', updateCanvasSize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      particlesRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[99999]"
      aria-hidden="true"
    />
  );
}

/**
 * Helper to draw a crisp 4-pointed sparkle star on canvas.
 */
function drawSparkleStar(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  const inner = size * 0.22;
  const outer = size * 1.35;

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const nextAngle = angle + Math.PI / 4;

    const ox = Math.cos(angle) * outer;
    const oy = Math.sin(angle) * outer;
    const ix = Math.cos(nextAngle) * inner;
    const iy = Math.sin(nextAngle) * inner;

    if (i === 0) {
      ctx.moveTo(ox, oy);
    } else {
      ctx.lineTo(ox, oy);
    }
    ctx.lineTo(ix, iy);
  }

  ctx.closePath();
  ctx.fill();
}

