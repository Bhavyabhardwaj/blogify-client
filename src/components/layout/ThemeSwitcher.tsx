
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ThemeSwitcher() {
  const { isDark } = useTheme();
  
  return (
    <div className="flex items-center">
      <ThemeToggle variant="icon" />
    </div>
  );
}
