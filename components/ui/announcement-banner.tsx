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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-40 mx-auto mb-12 mt-8 w-full max-w-6xl px-5 sm:px-6"
        >
          <div className="relative overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              
              {/* Content Section */}
              <div className="flex-1 min-w-0 pr-10 sm:pr-12">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <h3 className="text-sm font-medium text-foreground sm:text-base">
                    Java Bites is evolving
                  </h3>
                </div>
                
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  We’re continuously improving menus, vendor data, timings, and overall experience. 
                  If you spot incorrect prices, missing items, bugs, or have feature suggestions, please let us know.
                </p>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:right-5 sm:top-1/2 sm:-translate-y-1/2"
                aria-label="Dismiss announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
