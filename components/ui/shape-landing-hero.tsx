"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingEmojiProps {
  emoji: string;
  className: string;
  sizeClassName?: string;
  opacityClassName?: string;
  delay?: number;
  duration?: number;
  floatY?: number;
  rotateDeg?: number;
}

function FloatingEmoji({
  emoji,
  className,
  sizeClassName = "text-6xl md:text-8xl",
  opacityClassName = "opacity-25",
  delay = 0,
  duration = 8,
  floatY = 14,
  rotateDeg = 6,
}: FloatingEmojiProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      className={cn("absolute pointer-events-none select-none z-0", className)}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -floatY, 0],
                rotate: [-rotateDeg, rotateDeg, -rotateDeg],
              }
        }
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
        className={cn("filter drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all", sizeClassName, opacityClassName)}
      >
        {emoji}
      </motion.div>
    </motion.div>
  );
}

function HeroGeometric({
  badge = "Java Bites",
  title1 = "SRM's Food Court",
  title2 = "Every stall. Every menu.",
  title3 = "No Hassle.",
  subtitle = "The SRM food court — finally in one place.",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
  title3?: string;
  subtitle?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl pointer-events-none" />

      {/* Floating Food Emojis Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Top Left - Burger */}
        <FloatingEmoji
          emoji="🍔"
          className="left-[3%] sm:left-[6%] top-[8%]"
          sizeClassName="text-6xl sm:text-7xl md:text-8xl"
          opacityClassName="opacity-25"
          delay={0.2}
          duration={8}
          floatY={14}
          rotateDeg={6}
        />

        {/* Top Right - Pizza */}
        <FloatingEmoji
          emoji="🍕"
          className="right-[3%] sm:right-[6%] top-[10%]"
          sizeClassName="text-6xl sm:text-7xl md:text-8xl"
          opacityClassName="opacity-25"
          delay={0.4}
          duration={9}
          floatY={12}
          rotateDeg={-8}
        />

        {/* Top Center-Left (Desktop only) - Dumpling */}
        <FloatingEmoji
          emoji="🥟"
          className="left-[20%] top-[6%] hidden md:block"
          sizeClassName="text-5xl md:text-6xl"
          opacityClassName="opacity-20"
          delay={0.6}
          duration={7.5}
          floatY={10}
          rotateDeg={5}
        />

        {/* Top Center-Right (Desktop only) - Wrap */}
        <FloatingEmoji
          emoji="🌯"
          className="right-[20%] top-[8%] hidden md:block"
          sizeClassName="text-5xl md:text-6xl"
          opacityClassName="opacity-20"
          delay={0.7}
          duration={10}
          floatY={12}
          rotateDeg={-6}
        />

        {/* Mid Left (Tablet & Desktop) - Noodles */}
        <FloatingEmoji
          emoji="🍜"
          className="left-[2%] sm:left-[4%] top-[48%] hidden sm:block"
          sizeClassName="text-5xl sm:text-6xl md:text-7xl"
          opacityClassName="opacity-20"
          delay={0.5}
          duration={8.5}
          floatY={16}
          rotateDeg={-5}
        />

        {/* Mid Right (Tablet & Desktop) - Curry */}
        <FloatingEmoji
          emoji="🍛"
          className="right-[2%] sm:right-[4%] top-[50%] hidden sm:block"
          sizeClassName="text-5xl sm:text-6xl md:text-7xl"
          opacityClassName="opacity-20"
          delay={0.3}
          duration={9.5}
          floatY={14}
          rotateDeg={7}
        />

        {/* Bottom Left - Fries */}
        <FloatingEmoji
          emoji="🍟"
          className="left-[5%] sm:left-[8%] bottom-[8%]"
          sizeClassName="text-6xl sm:text-7xl md:text-8xl"
          opacityClassName="opacity-25"
          delay={0.8}
          duration={9}
          floatY={12}
          rotateDeg={-7}
        />

        {/* Bottom Right - Drink */}
        <FloatingEmoji
          emoji="🥤"
          className="right-[5%] sm:right-[8%] bottom-[10%]"
          sizeClassName="text-5xl sm:text-6xl md:text-7xl"
          opacityClassName="opacity-25"
          delay={0.9}
          duration={8}
          floatY={15}
          rotateDeg={8}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6"
          >
            <Circle className="h-2 w-2 fill-rose-500/80" />
            <span className="text-sm font-medium text-foreground/70">{badge}</span>
          </motion.div>

          {/* Title */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80 block">
                {title1}
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground/90 to-accent block">
                {title2}
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-primary to-foreground block">
                {title3}
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          >
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-normal">
              {subtitle}
            </p>
          </motion.div>

        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
    </div>
  );
}

export { HeroGeometric };