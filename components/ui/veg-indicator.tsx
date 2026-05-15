import React from 'react';
import { isVeg } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface VegIndicatorProps {
  value: any;
  className?: string;
}

export function VegIndicator({ value, className }: VegIndicatorProps) {
  const vegetarian = isVeg(value);
  
  return (
    <div 
      className={cn(
        "shrink-0 w-4 h-4 border flex items-center justify-center p-[2px]",
        vegetarian ? "border-emerald-500" : "border-red-500",
        className
      )}
      title={vegetarian ? "Vegetarian" : "Non-Vegetarian"}
    >
      <div 
        className={cn(
          "w-full h-full rounded-full",
          vegetarian ? "bg-emerald-500" : "bg-red-500"
        )} 
      />
    </div>
  );
}
