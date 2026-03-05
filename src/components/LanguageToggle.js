import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
    const { lang, toggle } = useLanguage();
    const isEn = lang === 'en';

    return (
        <button
            onClick={toggle}
            title={isEn ? 'Switch to Tamil' : 'Switch to English'}
            className="flex items-center gap-1 text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] p-1.5 rounded-lg hover:bg-[var(--color-cream)] transition-all"
            aria-label="Toggle language"
        >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold">{isEn ? 'EN' : 'TA'}</span>
        </button>
    );
};

export default LanguageToggle;
