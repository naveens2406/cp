import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!visible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-40 p-3 bg-primary text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-scale-in"
            title="Back to top"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
};

export default BackToTop;
