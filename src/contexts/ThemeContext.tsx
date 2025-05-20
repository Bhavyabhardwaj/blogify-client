<<<<<<< HEAD
=======

>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toggleTheme } from '@/lib/utils';

type ThemeContextType = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
<<<<<<< HEAD
  initialValue = true 
=======
  initialValue = false 
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
}: { 
  children: ReactNode; 
  initialValue?: boolean;
}) {
  const [isDark, setIsDark] = useState(initialValue);

  const toggleDarkMode = () => {
    toggleTheme(isDark, setIsDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
