import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryRange(low: number, high: number): string {
  return `${formatCurrency(low)} - ${formatCurrency(high)}`;
}

export function formatGrowthRate(rate: number): string {
  return `${rate > 0 ? "+" : ""}${rate}%`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

// Teen-friendly salary format: "$72k - $140k"
export function formatSalaryTeen(low: number, high: number): string {
  const lowK = Math.round(low / 1000);
  const highK = Math.round(high / 1000);
  return `$${lowK}k - $${highK}k`;
}

// Teen-friendly growth rate with emoji and label
export function formatGrowthRateTeen(rate: number): string {
  if (rate >= 25) return "\uD83D\uDE80 Exploding demand";
  if (rate >= 15) return "\uD83D\uDD25 Booming demand";
  if (rate >= 10) return "\uD83D\uDCC8 Growing fast";
  if (rate >= 5) return "\uD83D\uDC4D Steady demand";
  return "\u2705 Stable career";
}
