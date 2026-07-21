"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { VegIndicator } from "@/components/ui/veg-indicator";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { messMenu } from "@/data/messMenu";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

function getItemDietType(name: string): "veg" | "non-veg" | "both" {
  const lower = name.toLowerCase();
  
  if (lower.includes("chicken masala") && lower.includes("paneer")) {
    return "both";
  }
  
  if (
    lower.includes("chicken") ||
    lower.includes("mutton") ||
    lower.includes("fish") ||
    lower.includes("egg") ||
    lower.includes("omlet") ||
    lower.includes("meat") ||
    lower.includes("non-veg")
  ) {
    return "non-veg";
  }
  
  return "veg";
}

export function MessDashboard() {
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [detectedToday, setDetectedToday] = useState<string>("Monday");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const todayIndex = new Date().getDay();
    const todayName = weekdays[todayIndex];
    setSelectedDay(todayName);
    setDetectedToday(todayName);
    setMounted(true);
  }, []);

  const menu = messMenu[selectedDay] || messMenu.Monday;

  const categories = [
    {
      key: "breakfast",
      title: "Breakfast",
      icon: "🍳",
      items: menu.breakfast
    },
    {
      key: "lunch",
      title: "Lunch",
      icon: "🍛",
      items: menu.lunch
    },
    {
      key: "snacks",
      title: "Snacks",
      icon: "☕",
      items: menu.snacks
    },
    {
      key: "dinner",
      title: "Dinner",
      icon: "🍽️",
      items: menu.dinner
    }
  ];

  return (
    <main className="min-h-screen pb-20 bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Animated Paths */}
      <BackgroundPaths />

      {/* Dark gradient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-black opacity-70 pointer-events-none" />

      {/* Top Header Row */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-sm text-foreground/80 hover:text-foreground backdrop-blur-md transition-all font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <HeroGeometric
        badge="Hostel Dining"
        title1="Today's Mess"
        title2="Today's hostel dining menu"
      />

      {/* Controls: Day Selector */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 mb-12 relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">Weekly Schedule</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mounted && selectedDay === detectedToday
              ? `Automatically showing today's menu (${selectedDay})`
              : `Viewing menu for ${selectedDay}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" /> Day:
          </span>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-4 py-2 rounded-full border bg-white/[0.03] border-white/[0.08] text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:bg-white/[0.08] transition-all cursor-pointer font-medium text-sm backdrop-blur-md min-w-[150px] dark:bg-neutral-900"
          >
            {weekdays.map((day) => (
              <option key={day} value={day} className="bg-background text-foreground">
                {day} {mounted && day === detectedToday ? "(Today)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6 relative z-20">
        {categories.map((cat) => (
          <SpotlightCard
            key={cat.key}
            className="h-full border border-white/[0.08] bg-white/[0.02] dark:bg-[#261e15]/20 backdrop-blur-md"
          >
            <div className="p-6 flex flex-col h-full">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-label={cat.title}>
                    {cat.icon}
                  </span>
                  <h3 className="text-xl font-bold text-foreground">{cat.title}</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-muted-foreground font-medium">
                  {cat.items.length} items
                </span>
              </div>

              {/* Card Content */}
              <ul className="space-y-2.5 flex-grow">
                {cat.items.map((item, idx) => {
                  const diet = getItemDietType(item);
                  return (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-3 text-sm text-foreground/90 py-1.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors"
                    >
                      <span className="font-medium tracking-wide leading-relaxed">{item}</span>
                      <div className="flex items-center gap-1.5">
                        {diet === "both" ? (
                          <>
                            <VegIndicator value={true} />
                            <VegIndicator value={false} />
                          </>
                        ) : (
                          <VegIndicator value={diet === "veg"} />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Information and Footer Section */}
      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-6 relative z-20">
        
        {/* Special Bi-Weekly Schedule */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5" role="img" aria-label="chicken">
              🍗
            </span>
            <div>
              <h4 className="font-bold text-amber-500 text-sm">Special Bi-Weekly Schedule</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                MONTHLY TWICE (2nd & 4th Wednesday) WE PROVIDED CHICKEN BRIYANI & PANEER BRIYANI
              </p>
            </div>
          </div>
          <div className="text-xs px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold self-start sm:self-auto uppercase tracking-wide">
            Bi-Weekly Special
          </div>
        </div>

        {/* Limited Items Notice */}
        <div className="rounded-2xl border border-border/40 bg-white/[0.01] p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground flex items-center gap-1.5">
            ⚠️ Important Note:
          </p>
          <p className="pl-5 leading-relaxed">
            Special Items (Chicken, Egg, Fruits, Ice Cream, Sweet) are Limited. Menu is planned based on the availability of seasonal vegetables and planned by Mess Management from time to time.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-border/40 pt-8 text-center space-y-2">
          <p className="text-sm font-semibold text-foreground/80">
            Last Updated: July 20, 2026
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Menu is based on the official hostel schedule and may change without prior notice.
          </p>
        </div>
      </div>
    </main>
  );
}
