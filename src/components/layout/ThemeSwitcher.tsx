
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ThemeSwitcher({ variant = "icon" }: { variant?: "icon" | "button" | "switch" }) {
  const { isDark, toggleDarkMode } = useTheme();
  
  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className="rounded-full"
      >
        {isDark ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }
  
  if (variant === "switch") {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleDarkMode}
        className="flex items-center gap-2"
      >
        {isDark ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Sun className="h-4 w-4" />
            <span>Light Mode</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Moon className="h-4 w-4" />
            <span>Dark Mode</span>
          </motion.div>
        )}
      </Button>
    );
  }
  
  // Default to icon toggle
  return (
    <div className="flex items-center">
      <ThemeToggle variant="icon" />
    </div>
  );
}
