import React, { useState, useEffect } from 'react';
import './LaunchAnnouncementPopup.less';

const LaunchAnnouncementPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const launchDate = new Date('2026-02-02T00:00:00');
  const now = new Date();

  useEffect(() => {
    // Don't show popup if launch date has passed
    if (now >= launchDate) {
      return;
    }

    // Check if user has already closed the popup in this session
    const popupClosed = sessionStorage.getItem('launchPopupClosed');
    if (!popupClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('launchPopupClosed', 'true');
  };

  if (!isVisible || now >= launchDate) {
    return null;
  }

  return (
    <div className="launch-popup">
      <div className="launch-popup__overlay" onClick={handleClose}></div>
      <div className="launch-popup__content">
        <button
          className="launch-popup__close"
          onClick={handleClose}
          aria-label="Zavrieť"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="launch-popup__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>

        <h2 className="launch-popup__title">Otvárame 2.2.2026</h2>

        <p className="launch-popup__message">
          Objednávanie zatiaľ nie je dostupné. Tešíme sa na Vás od 2. februára 2026!
        </p>

        <p className="launch-popup__submessage">
          Môžete si prezrieť naše menu aby ste vedeli, na čo sa môžete tešiť!
        </p>

        <button className="launch-popup__button" onClick={handleClose}>
          Rozumiem
        </button>
      </div>
    </div>
  );
};

export default LaunchAnnouncementPopup;
