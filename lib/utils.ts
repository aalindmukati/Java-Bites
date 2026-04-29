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
