import React, { useCallback, useEffect, useState } from 'react';
import { applyConsent } from '../../../utils/analytics';
import {
  NO_OPTIONAL_CONSENT,
  OPEN_COOKIE_SETTINGS_EVENT,
  readConsent,
  saveConsent,
  type ConsentChoices,
} from '../../../utils/consent';
import { useLocale } from '../../../i18n/LocaleContext';
import { CookieBanner } from './CookieBanner/CookieBanner';
import { CookiePreferences } from './CookiePreferences/CookiePreferences';
import './CookieConsent.less';

const ALL_OPTIONAL_CONSENT: ConsentChoices = {
  analytics: true,
  marketing: true,
};

/** Asks until a valid decision exists, and reopens from the footer link. */
const CookieConsent: React.FC = () => {
  const { locale } = useLocale();
  const [isBannerVisible, setIsBannerVisible] = useState(
    () => readConsent() === null,
  );
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    const open = () => setIsPreferencesOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
  }, []);

  const decide = useCallback(
    (choices: ConsentChoices) => {
      saveConsent(choices);
      applyConsent(choices, locale);
      setIsBannerVisible(false);
      setIsPreferencesOpen(false);
    },
    [locale],
  );

  const acceptAll = useCallback(() => decide(ALL_OPTIONAL_CONSENT), [decide]);
  const rejectAll = useCallback(() => decide(NO_OPTIONAL_CONSENT), [decide]);
  const openPreferences = useCallback(() => setIsPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setIsPreferencesOpen(false), []);

  return (
    <>
      {isBannerVisible && !isPreferencesOpen && (
        <CookieBanner
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onOpenSettings={openPreferences}
        />
      )}
      {isPreferencesOpen && (
        <CookiePreferences
          initialChoices={readConsent() ?? NO_OPTIONAL_CONSENT}
          onSave={decide}
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onClose={closePreferences}
        />
      )}
    </>
  );
};

export default CookieConsent;
