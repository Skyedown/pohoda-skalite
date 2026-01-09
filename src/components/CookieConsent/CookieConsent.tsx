import React, { useState, useEffect } from 'react';
import { updateConsent } from '../../utils/analytics';
import './CookieConsent.less';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    updateConsent(true);
    closeBar();
  };

  const handleReject = () => {
    updateConsent(false);
    closeBar();
  };

  const closeBar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`cookie-consent ${isClosing ? 'cookie-consent--closing' : ''}`}>
      <div className="container">
        <div className="cookie-consent__content">
          <div className="cookie-consent__text">
            <h3 className="cookie-consent__title">Súbory cookies</h3>
            <p className="cookie-consent__description">
              Táto webová stránka používa súbory cookies na zlepšenie používateľskej skúsenosti
              a analýzu návštevnosti. Používame Google Analytics pre meranie výkonnosti webu.
              Vaše údaje sú anonymizované a slúžia len na štatistické účely.
            </p>
          </div>
          <div className="cookie-consent__actions">
            <button
              onClick={handleReject}
              className="cookie-consent__button cookie-consent__button--reject"
            >
              Odmietnuť
            </button>
            <button
              onClick={handleAccept}
              className="cookie-consent__button cookie-consent__button--accept"
            >
              Súhlasím
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
