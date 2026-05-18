"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage after component mounts to prevent hydration mismatch
    const isDismissed = localStorage.getItem("announcement-dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("announcement-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl mx-auto px-4 mt-8 mb-12 z-40"
        >
          {/* Gradient Border Wrapper */}
          <div className="relative group rounded-2xl p-[1px] bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-colors duration-500 overflow-hidden">
            
            {/* Glassmorphism Container */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#09090b]/80 backdrop-blur-xl border border-white/[0.05] shadow-2xl">
              
              {/* Content Section */}
              <div className="flex-1 min-w-0 pr-8 md:pr-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                    Beta
                  </span>
                  <h3 className="text-sm sm:text-base font-medium text-zinc-100 flex items-center gap-1.5 truncate">
                    <span>🚧</span> Java Bites is actively evolving
                  </h3>
                </div>
                
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  We’re continuously improving menus, vendor data, timings, and overall experience. 
                  If you spot incorrect prices, missing items, bugs, or have feature suggestions, please let us know.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t border-white/5 md:border-t-0">
                <a 
                  href="mailto:feedback@javabites.app?subject=Java Bites Feedback"
                  className="relative group/btn w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-zinc-900 bg-zinc-100 rounded-full transition-all duration-300 hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">Report Feedback</span>
                  {/* Subtle Glow */}
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </a>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 md:top-1/2 md:-translate-y-1/2 md:right-5 p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-full transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Decorative background glow inside the border wrapper */}
            <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm opacity-50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
