import React, { useState, useEffect } from 'react';

const PageProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handler = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const total = scrollHeight - clientHeight;
            setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
        };
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
            <div
                className="h-full bg-gradient-to-r from-primary via-pink-400 to-primary/60 transition-all duration-100"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default PageProgressBar;
