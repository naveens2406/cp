import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('sop_lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('sop_lang', lang);
        // Set html lang attribute for accessibility
        document.documentElement.lang = lang === 'ta' ? 'ta' : 'en';
    }, [lang]);

    const toggle = () => setLang(l => (l === 'en' ? 'ta' : 'en'));
    const t = translations[lang];

    return (
        <LanguageContext.Provider value={{ lang, toggle, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
