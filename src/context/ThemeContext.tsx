import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'teal' | 'indigo' | 'midnight' | 'emerald' | 'rose';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  description: string;
  primaryBg: string;
  badgeBg: string;
  accentColor: string;
  isDark?: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'teal',
    name: 'Serene Teal',
    description: 'Calm ocean teal with warm alabaster canvas and slate typography.',
    primaryBg: 'bg-teal-600',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    accentColor: '#0d9488',
    isDark: false,
  },
  {
    id: 'indigo',
    name: 'Nordic Indigo',
    description: 'Crisp, high-contrast Nordic indigo and slate-900 palette.',
    primaryBg: 'bg-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentColor: '#4f46e5',
    isDark: false,
  },
  {
    id: 'midnight',
    name: 'Midnight Obsidian',
    description: 'Deep obsidian dark mode for comfortable night viewing.',
    primaryBg: 'bg-indigo-500',
    badgeBg: 'bg-slate-800 text-indigo-300 border-slate-700',
    accentColor: '#6366f1',
    isDark: true,
  },
  {
    id: 'emerald',
    name: 'Sage Emerald',
    description: 'Safe sage and forest green security & trust theme.',
    primaryBg: 'bg-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    accentColor: '#059669',
    isDark: false,
  },
  {
    id: 'rose',
    name: 'Terracotta Rose',
    description: 'Warm blush alabaster with deep terracotta rose accents.',
    primaryBg: 'bg-rose-600',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    accentColor: '#e11d48',
    isDark: false,
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  currentThemeOption: ThemeOption;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('parwah_theme');
    if (
      saved &&
      (saved === 'teal' ||
        saved === 'indigo' ||
        saved === 'midnight' ||
        saved === 'emerald' ||
        saved === 'rose')
    ) {
      return saved as ThemeMode;
    }
    return 'teal';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('parwah_theme', mode);
  };

  useEffect(() => {
    const body = document.body;
    body.classList.remove(
      'theme-teal',
      'theme-indigo',
      'theme-midnight',
      'theme-emerald',
      'theme-rose',
      'dark'
    );
    body.classList.add(`theme-${theme}`);
    if (theme === 'midnight') {
      body.classList.add('dark');
    }
  }, [theme]);

  const currentThemeOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        currentThemeOption,
        isDark: theme === 'midnight',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
