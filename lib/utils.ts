import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isOpen = (vendorName: string) => {
  const now = new Date();
  const hour = now.getHours();

  if (vendorName === "S.R Chat Corner") {
    return hour >= 16 && hour <= 23; // custom timing
  }

  return hour >= 11 && hour <= 23;
};

export const isVeg = (value: any): boolean => {
  if (value === null || value === undefined) return true; // Default to veg
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return !!value;
};
