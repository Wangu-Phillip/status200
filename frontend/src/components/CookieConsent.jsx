import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('bocra_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('bocra_cookie_consent', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('bocra_cookie_consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-slate-300 p-4 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p className="font-semibold text-white mb-1">🍪 We use cookies</p>
          <p>
            We use analytics and tracking cookies to enhance your experience, analyze site usage, and assist in our digital services. 
            By clicking "Accept All", you consent to our use of cookies according to our Privacy Policy.
          </p>
        </div>
        <div className="flex gap-3 whitespace-nowrap">
          <Button variant="outline" className="text-slate-900" onClick={declineCookies}>
            Decline
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={acceptCookies}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
