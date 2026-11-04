import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../../../i18n/LocaleContext';

interface CookieBannerProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onOpenSettings: () => void;
}

/** First layer: rejecting is as easy and as prominent as accepting. */
export const CookieBanner: React.FC<CookieBannerProps> = ({
  onAcceptAll,
  onRejectAll,
  onOpenSettings,
}) => {
  const { t } = useLocale();

  return (
    <section
      className="cookie-consent"
      role="region"
      aria-labelledby="cookie-consent-title"
    >
      <div className="container">
        <div className="cookie-consent__content">
          <div className="cookie-consent__text">
            <h2 id="cookie-consent-title" className="cookie-consent__title">
              {t('cookie_title')}
            </h2>
            <p className="cookie-consent__description">
              {t('cookie_description')} {t('cookie_more')}{' '}
              <Link to={t('privacy_path')} className="cookie-consent__link">
                {t('privacy_title')}
              </Link>
              .
            </p>
          </div>
          <div className="cookie-consent__actions">
            <button
              type="button"
              onClick={onOpenSettings}
              className="cookie-consent__button cookie-consent__button--settings"
            >
              {t('cookie_settings')}
            </button>
            <button
              type="button"
              onClick={onRejectAll}
              className="cookie-consent__button cookie-consent__button--choice"
            >
              {t('cookie_reject_all')}
            </button>
            <button
              type="button"
              onClick={onAcceptAll}
              className="cookie-consent__button cookie-consent__button--choice"
            >
              {t('cookie_accept_all')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
