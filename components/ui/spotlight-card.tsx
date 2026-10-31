import React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SpotlightCard({
  children,
  className,
  ...props
}: SpotlightCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-150 hover:border-primary/50",
        className
      )}
      {...props}
    >
      <div className="h-full">{children}</div>
    </div>
  );
}
