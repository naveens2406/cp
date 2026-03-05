import React, { useState, useEffect } from 'react';
import { Cookie, X, Shield } from 'lucide-react';

const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('cookieConsent');
        if (!accepted) setTimeout(() => setVisible(true), 1500);
    }, []);

    const accept = () => { localStorage.setItem('cookieConsent', 'accepted'); setVisible(false); };
    const decline = () => { localStorage.setItem('cookieConsent', 'declined'); setVisible(false); };

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 animate-fade-in-up">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-5">
                <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
                        <Cookie className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center space-x-1">
                            <span>We use cookies</span>
                            <Shield className="h-3.5 w-3.5 text-green-500" />
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            We use cookies to improve your experience and understand how you use our site. No personal data is shared with third parties.
                        </p>
                    </div>
                    <button onClick={decline} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={accept}
                        className="flex-1 bg-primary text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={decline}
                        className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
