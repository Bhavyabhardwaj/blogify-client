
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "Unknown date";
  
  try {
    // Handle standard ISO date format
    const parsedDate = new Date(date);
    
    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date value: ${date}`);
      return "Unknown date";
    }
    
    // Get current date for comparison
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = 
      parsedDate.getDate() === now.getDate() &&
      parsedDate.getMonth() === now.getMonth() &&
      parsedDate.getFullYear() === now.getFullYear();
    
    const isYesterday = 
      parsedDate.getDate() === yesterday.getDate() &&
      parsedDate.getMonth() === yesterday.getMonth() &&
      parsedDate.getFullYear() === yesterday.getFullYear();
    
    // For today's dates, show relative time
    if (isToday) {
      const diffMs = now.getTime() - parsedDate.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) {
        return 'Just now';
      } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      }
      
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(parsedDate);
    }
    
    // For yesterday
    if (isYesterday) {
      return `Yesterday at ${new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(parsedDate)}`;
    }
    
    // For this year but not today or yesterday
    if (parsedDate.getFullYear() === now.getFullYear()) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(parsedDate);
    }
    
    // For any other date, show the full date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(parsedDate);
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "Unknown date";
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Function to toggle dark mode
export function toggleTheme(isDark: boolean, setIsDark: (dark: boolean) => void) {
  const newTheme = !isDark;
  setIsDark(newTheme);
  
  // Update DOM
  if (newTheme) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

// Function to initialize theme based on localStorage or system preference
export function initializeTheme(): boolean {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
  
  // Apply theme to document
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  return isDark;
}
