import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateConsent } from '../../../utils/analytics';
import { useLocale } from '../../../i18n/LocaleContext';
import './CookieConsent.less';

const CookieConsent: React.FC = () => {
  const { t, locale } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeBar = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleAccept = () => {
    updateConsent(true, locale);
    closeBar();
  };

  const handleReject = () => {
    updateConsent(false, locale);
    closeBar();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`cookie-consent ${isClosing ? 'cookie-consent--closing' : ''}`}
    >
      <div className="container">
        <div className="cookie-consent__content">
          <div className="cookie-consent__text">
            <h3 className="cookie-consent__title">{t('cookie_title')}</h3>
            <p className="cookie-consent__description">
              {t('cookie_description')}{' '}
              <Link to={t('privacy_path')} className="cookie-consent__link">
                {t('privacy_title')}
              </Link>
            </p>
          </div>
          <div className="cookie-consent__actions">
            <button
              onClick={handleReject}
              className="cookie-consent__button cookie-consent__button--reject"
            >
              {t('cookie_reject')}
            </button>
            <button
              onClick={handleAccept}
              className="cookie-consent__button cookie-consent__button--accept"
            >
              {t('cookie_accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
