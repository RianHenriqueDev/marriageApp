import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateToken(name: string): string {
  const sanitized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${sanitized || "convidado"}-${randomPart}`;
}

export const WEDDING_DATE = new Date("2026-12-12T10:30:00-03:00");
