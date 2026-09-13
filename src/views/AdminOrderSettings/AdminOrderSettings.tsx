import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  getAdminSettings,
  saveAdminSettings,
  DEFAULT_SETTINGS,
  type AdminSettings,
  type AnnouncementMode,
} from '../../utils/adminSettings';
import type { LocalizedText } from '../../i18n/types';
import { AdminModeSelector } from '../../components/AdminPanel/AdminModeSelector/AdminModeSelector';
import { AdminWaitTimeSection } from '../../components/AdminPanel/AdminWaitTimeSection/AdminWaitTimeSection';
import { AdminLocalizedTextareaSection } from '../../components/AdminPanel/AdminLocalizedTextareaSection/AdminLocalizedTextareaSection';
import { AdminCardPayment } from '../../components/AdminPanel/AdminCardPayment/AdminCardPayment';
import { AdminSaveActions } from '../../components/AdminPanel/AdminSaveActions/AdminSaveActions';
import '../AdminPanel/AdminPanel.less';

const AdminOrderSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      setSettings(await getAdminSettings());
    };
    loadSettings();
  }, []);

  const handleModeChange = useCallback((mode: AnnouncementMode) => {
    setSettings((prev) => ({ ...prev, mode }));
    setSaveSuccess(false);
  }, []);

  const handleWaitTimeChange = useCallback((waitTimeMinutes: number) => {
    setSettings((prev) => ({ ...prev, waitTimeMinutes }));
    setSaveSuccess(false);
  }, []);

  const handleCustomNoteChange = useCallback((customNote: LocalizedText) => {
    setSettings((prev) => ({ ...prev, customNote }));
    setSaveSuccess(false);
  }, []);

  const handleDisabledReasonChange = useCallback(
    (disabledReason: LocalizedText) => {
      setSettings((prev) => ({ ...prev, disabledReason }));
      setSaveSuccess(false);
    },
    [],
  );

  const handleCardPaymentToggle = useCallback((type: 'delivery' | 'pickup') => {
    setSettings((prev) => ({
      ...prev,
      cardPaymentDeliveryEnabled:
        type === 'delivery'
          ? !prev.cardPaymentDeliveryEnabled
          : prev.cardPaymentDeliveryEnabled,
      cardPaymentPickupEnabled:
        type === 'pickup'
          ? !prev.cardPaymentPickupEnabled
          : prev.cardPaymentPickupEnabled,
    }));
    setSaveSuccess(false);
  }, []);

  const handleSave = useCallback(async () => {
    setSaveSuccess(false);
    setSaveError('');

    const savedSettings = await saveAdminSettings(settings);

    if (savedSettings) {
      setSettings(savedSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      localStorage.setItem('adminSettingsLastUpdate', Date.now().toString());
      window.dispatchEvent(
        new CustomEvent('adminSettingsChanged', { detail: savedSettings }),
      );
    } else {
      setSaveError('Nepodarilo sa uložiť nastavenia. Skúste to znova.');
      setTimeout(() => setSaveError(''), 5000);
    }
  }, [settings]);

  return (
    <div className="admin-panel">
      <Helmet>
        <title>Správa objednávok | Admin Panel | Pohoda Skalité</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-panel__container">
        <div className="admin-panel__header">
          <h1 className="admin-panel__title">Správa objednávok</h1>
          <Link to="/admin" className="admin-panel__logout">
            ← Hlavná stránka
          </Link>
        </div>

        <div className="admin-panel__content">
          <p className="admin-panel__section-description">
            Tieto nastavenia platia naraz pre slovenský aj poľský web.
          </p>

          <AdminModeSelector mode={settings.mode} onChange={handleModeChange} />

          {settings.mode === 'waitTime' && (
            <AdminWaitTimeSection
              waitTimeMinutes={settings.waitTimeMinutes}
              onChange={handleWaitTimeChange}
            />
          )}

          {settings.mode === 'disabled' && (
            <AdminLocalizedTextareaSection
              id="disabledReason"
              title="Dôvod pozastavenia"
              label="Text oznámenia"
              placeholderSk="Zadajte dôvod pozastavenia objednávok..."
              placeholderPl="Wpisz powód wstrzymania zamówień..."
              value={settings.disabledReason}
              onChange={handleDisabledReasonChange}
            />
          )}

          {settings.mode === 'customNote' && (
            <AdminLocalizedTextareaSection
              id="customNote"
              title="Vlastná poznámka"
              label="Text oznámenia"
              placeholderSk="Zadajte vlastné oznámenie pre zákazníkov..."
              placeholderPl="Wpisz własne ogłoszenie dla klientów..."
              value={settings.customNote}
              onChange={handleCustomNoteChange}
            />
          )}

          <AdminCardPayment
            deliveryEnabled={settings.cardPaymentDeliveryEnabled}
            pickupEnabled={settings.cardPaymentPickupEnabled}
            onToggle={handleCardPaymentToggle}
          />

          <AdminSaveActions
            onSave={handleSave}
            saveSuccess={saveSuccess}
            saveError={saveError}
          />

          <div className="admin-panel__footer">
            <Link to="/" className="admin-panel__back-link">
              ← Späť na hlavnú stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderSettings;
