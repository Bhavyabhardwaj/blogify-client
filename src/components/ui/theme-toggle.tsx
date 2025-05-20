
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className, variant = "icon" }: { className?: string, variant?: "icon" | "switch" | "toggle" }) {
  const { isDark, toggleDarkMode } = useTheme();
  
  // Icon button variant
  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className={cn("rounded-full", className)}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        ) : (
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }
  
  // Switch variant
  if (variant === "switch") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Sun className="h-4 w-4" />
        <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
        <Moon className="h-4 w-4" />
      </div>
    );
  }
  
  // Toggle variant
  return (
    <Toggle
      pressed={isDark}
      onPressedChange={toggleDarkMode}
      className={cn("", className)}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="ml-2">{isDark ? 'Dark' : 'Light'}</span>
    </Toggle>
  );
}
