import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getOpenStatus = (date: Date = new Date()): boolean => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hour12: false
  });
  const hour = parseInt(formatter.format(date), 10);
  return hour >= 9 && hour < 23;
};

export const isOpen = (vendorName?: string, databaseIsOpen?: boolean): boolean => {
  if (databaseIsOpen === false) return false;
  return getOpenStatus();
};

export const isVeg = (value: any): boolean => {
  if (value === null || value === undefined) return true; // Default to veg
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return !!value;
};
