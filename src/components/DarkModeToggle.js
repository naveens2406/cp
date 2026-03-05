import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

// Apply dark mode class on HTML element
const applyDark = (dark) => {
    if (dark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

export const useDarkMode = () => {
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? saved === 'true' : false;
    });

    useEffect(() => {
        applyDark(dark);
        localStorage.setItem('darkMode', dark);
    }, [dark]);

    return [dark, setDark];
};

const DarkModeToggle = () => {
    const [dark, setDark] = useDarkMode();

    return (
        <button
            onClick={() => setDark(!dark)}
            className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-cream)] transition-all"
            title={dark ? 'Light Mode' : 'Dark Mode'}
        >
            {dark
                ? <Sun className="h-4 w-4 text-yellow-500" />
                : <Moon className="h-4 w-4" />
            }
        </button>
    );
};

export default DarkModeToggle;
