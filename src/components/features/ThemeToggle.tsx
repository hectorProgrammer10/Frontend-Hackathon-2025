// Theme Toggle Component
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-300
                 text-white/70 hover:text-white hover:bg-white/10
                 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10
                 bg-white/5 border border-white/5
                 hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Moon size={20} className="fill-purple-500/20 text-purple-400" />
      ) : (
        <Sun size={20} className="fill-yellow-500/20 text-yellow-400" />
      )}
    </button>
  );
}
