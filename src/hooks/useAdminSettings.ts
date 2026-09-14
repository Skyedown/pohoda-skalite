import { useState, useEffect } from 'react';
import {
  getAdminSettings,
  DEFAULT_SETTINGS,
  type AdminSettings,
} from '../utils/adminSettings';

export function useAdminSettings(): AdminSettings {
  const [adminSettings, setAdminSettings] =
    useState<AdminSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      setAdminSettings(await getAdminSettings());
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
