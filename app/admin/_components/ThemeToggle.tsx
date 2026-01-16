"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from '../../ThemeProvider';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

    const toggle = () => setTheme(isDark ? 'light' : 'dark');

    return (
        <button
            role="switch"
            aria-checked={isDark}
            onClick={toggle}
            title={isDark ? 'Switch to light' : 'Switch to dark'}
            className="relative w-20 h-10 rounded-2xl focus:outline-none cursor-pointer"
        >
            {/* background */}
            <span className="absolute inset-0 rounded-2xl bg-card" />

            {/* knob */}
            <span
                data-theme-toggle-knob
                className="absolute top-1 w-8 h-8 bg-primary rounded-xl shadow-lg"
                style={{
                    left: isDark ? '44px' : '4px',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            />

            {/* ícones */}
            <Sun className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 ${isDark ? 'text-foreground opacity-50' : 'text-background opacity-100'}`} />
            <Moon className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 ${isDark ? 'text-foreground opacity-100' : 'text-foreground opacity-50'}`} />
        </button>
    );
}
