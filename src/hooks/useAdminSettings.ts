import { useState, useEffect } from 'react';
import { getAdminSettings, type AdminSettings } from '../utils/adminSettings';

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  mode: 'off',
  waitTimeMinutes: 60,
  customNote:
    'Z dôvodu nepriaznivého počasia je donáška možná len k hlavnej ceste',
  disabledReason:
    'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
  disabledProductTypes: [],
};

export function useAdminSettings(): AdminSettings {
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(
    DEFAULT_ADMIN_SETTINGS,
  );

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getAdminSettings();
      setAdminSettings(settings);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent<AdminSettings>) => {
      setAdminSettings(event.detail);
    };

    window.addEventListener(
      'adminSettingsChanged',
      handleSettingsChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        'adminSettingsChanged',
        handleSettingsChange as EventListener,
      );
    };
  }, []);

  return adminSettings;
}
