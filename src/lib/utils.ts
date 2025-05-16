
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "Unknown date";
  
  try {
    // Check if the date is valid before formatting
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date value received: ${date}`);
      return "Unknown date";
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(parsedDate);
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "Unknown date";
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function getInitials(name: string): string {
  if (!name) return "U"
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
