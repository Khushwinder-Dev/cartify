'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  align?: 'left' | 'right';
}

export default function ThemeToggle({ className = '', align = 'right' }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full bg-neutral-100 dark:bg-zinc-800/80 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 ${className}`}
        aria-label={`Current theme: ${theme}. Click to change theme.`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Sun Icon */}
        <Sun
          className={`w-4 h-4 transition-all duration-300 absolute ${
            isDark
              ? 'scale-0 -rotate-90 opacity-0'
              : 'scale-100 rotate-0 opacity-100 text-amber-500'
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-4 h-4 transition-all duration-300 absolute ${
            isDark
              ? 'scale-100 rotate-0 opacity-100 text-indigo-400'
              : 'scale-0 rotate-90 opacity-0'
          }`}
        />
      </button>

      {/* Accessible Theme Selector Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-36 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150`}
        >
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Appearance
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              theme === 'light'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </span>
            {theme === 'light' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </span>
            {theme === 'dark' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              theme === 'system'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>System</span>
            </span>
            {theme === 'system' && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
          </button>
        </div>
      )}
    </div>
  );
}
