import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../../../i18n/LocaleContext';
import type { ConsentChoices } from '../../../../utils/consent';
import { CookieCategory } from '../CookieCategory/CookieCategory';

interface CookiePreferencesProps {
  initialChoices: ConsentChoices;
  onSave: (choices: ConsentChoices) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
}

/** Second layer: one switch per purpose, all optional ones off until chosen. */
export const CookiePreferences: React.FC<CookiePreferencesProps> = ({
  initialChoices,
  onSave,
  onAcceptAll,
  onRejectAll,
  onClose,
}) => {
  const { t } = useLocale();
  const [analytics, setAnalytics] = useState(initialChoices.analytics);
  const [marketing, setMarketing] = useState(initialChoices.marketing);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSave = useCallback(
    () => onSave({ analytics, marketing }),
    [onSave, analytics, marketing],
  );

  return (
    <div className="cookie-preferences" role="presentation">
      <div
        className="cookie-preferences__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
      >
        <div className="cookie-preferences__header">
          <h2
            id="cookie-preferences-title"
            ref={titleRef}
            tabIndex={-1}
            className="cookie-preferences__title"
          >
            {t('cookie_settings_title')}
          </h2>
          <button
            type="button"
            className="cookie-preferences__close"
            onClick={onClose}
            aria-label={t('common_close')}
          >
            ✕
          </button>
        </div>

        <p className="cookie-preferences__intro">
          {t('cookie_settings_intro')}{' '}
          <Link to={t('privacy_path')} onClick={onClose}>
            {t('privacy_title')}
          </Link>
        </p>

        <CookieCategory
          id="necessary"
          title={t('cookie_cat_necessary_title')}
          description={t('cookie_cat_necessary_text')}
          checked
          lockedLabel={t('cookie_always_on')}
        />
        <CookieCategory
          id="analytics"
          title={t('cookie_cat_analytics_title')}
          description={t('cookie_cat_analytics_text')}
          checked={analytics}
          onChange={setAnalytics}
        />
        <CookieCategory
          id="marketing"
          title={t('cookie_cat_marketing_title')}
          description={t('cookie_cat_marketing_text')}
          checked={marketing}
          onChange={setMarketing}
        />

        <div className="cookie-preferences__actions">
          <button
            type="button"
            className="cookie-preferences__button"
            onClick={onRejectAll}
          >
            {t('cookie_reject_all')}
          </button>
          <button
            type="button"
            className="cookie-preferences__button"
            onClick={handleSave}
          >
            {t('cookie_save')}
          </button>
          <button
            type="button"
            className="cookie-preferences__button"
            onClick={onAcceptAll}
          >
            {t('cookie_accept_all')}
          </button>
        </div>
      </div>
    </div>
  );
};
