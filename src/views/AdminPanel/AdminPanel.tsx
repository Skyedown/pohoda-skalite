import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettings,
  type AnnouncementMode,
} from '../../utils/adminSettings';
import AdminOrderCreationModal from '../../components/AdminOrderCreation/AdminOrderCreationModal';
import { AdminQuickActions } from '../../components/AdminPanel/AdminQuickActions/AdminQuickActions';
import { AdminModeSelector } from '../../components/AdminPanel/AdminModeSelector/AdminModeSelector';
import { AdminWaitTimeSection } from '../../components/AdminPanel/AdminWaitTimeSection/AdminWaitTimeSection';
import { AdminTextareaSection } from '../../components/AdminPanel/AdminTextareaSection/AdminTextareaSection';
import { AdminProductAvailability } from '../../components/AdminPanel/AdminProductAvailability/AdminProductAvailability';
import { AdminCardPayment } from '../../components/AdminPanel/AdminCardPayment/AdminCardPayment';
import { AdminSaveActions } from '../../components/AdminPanel/AdminSaveActions/AdminSaveActions';
import { DEFAULT_SETTINGS } from '../../components/AdminPanel/adminPanelHelpers';
import './AdminPanel.less';

const AdminPanel: React.FC = () => {
  const [isOrderCreationModalOpen, setIsOrderCreationModalOpen] =
    useState(false);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const loaded = await getAdminSettings();
      setSettings({
        ...DEFAULT_SETTINGS,
        ...loaded,
      });
    };
    loadSettings();
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/admin';
  }, []);

  const handleModeChange = useCallback((mode: AnnouncementMode) => {
    setSettings((prev) => ({ ...prev, mode }));
    setSaveSuccess(false);
  }, []);

  const handleWaitTimeChange = useCallback((waitTimeMinutes: number) => {
    setSettings((prev) => ({ ...prev, waitTimeMinutes }));
    setSaveSuccess(false);
  }, []);

  const handleCustomNoteChange = useCallback((customNote: string) => {
    setSettings((prev) => ({ ...prev, customNote }));
    setSaveSuccess(false);
  }, []);

  const handleDisabledReasonChange = useCallback((disabledReason: string) => {
    setSettings((prev) => ({ ...prev, disabledReason }));
    setSaveSuccess(false);
  }, []);

  const handleProductTypeToggle = useCallback(
    (productType: 'pizza' | 'burger' | 'langos' | 'sides') => {
      setSettings((prev) => {
        const current = prev.disabledProductTypes || [];
        const isDisabled = current.includes(productType);
        return {
          ...prev,
          disabledProductTypes: isDisabled
            ? current.filter((t) => t !== productType)
            : [...current, productType],
        };
      });
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

  const handleOpenNewOrder = useCallback(
    () => setIsOrderCreationModalOpen(true),
    [],
  );

  return (
    <div className="admin-panel">
      <Helmet>
        <title>Admin Panel | Pohoda Skalite</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-panel__container">
        <div className="admin-panel__header">
          <h1 className="admin-panel__title">Správa oznámení</h1>
          <button onClick={handleLogout} className="admin-panel__logout">
            Odhlásiť sa
          </button>
        </div>

        <div className="admin-panel__content">
          <AdminQuickActions onNewOrder={handleOpenNewOrder} />

          <AdminModeSelector mode={settings.mode} onChange={handleModeChange} />

          {settings.mode === 'waitTime' && (
            <AdminWaitTimeSection
              waitTimeMinutes={settings.waitTimeMinutes}
              onChange={handleWaitTimeChange}
            />
          )}

          {settings.mode === 'disabled' && (
            <AdminTextareaSection
              id="disabledReason"
              title="Dôvod pozastavenia"
              label="Text oznámenia:"
              placeholder="Zadajte dôvod pozastavenia objednávok..."
              value={settings.disabledReason || ''}
              onChange={handleDisabledReasonChange}
            />
          )}

          {settings.mode === 'customNote' && (
            <AdminTextareaSection
              id="customNote"
              title="Vlastná poznámka"
              label="Text oznámenia:"
              placeholder="Zadajte vlastné oznámenie pre zákazníkov..."
              value={settings.customNote || ''}
              onChange={handleCustomNoteChange}
            />
          )}

          <AdminProductAvailability
            disabledProductTypes={settings.disabledProductTypes || []}
            onToggle={handleProductTypeToggle}
          />

          <AdminCardPayment
            deliveryEnabled={settings.cardPaymentDeliveryEnabled || false}
            pickupEnabled={settings.cardPaymentPickupEnabled || false}
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

      <AdminOrderCreationModal
        isOpen={isOrderCreationModalOpen}
        onClose={() => setIsOrderCreationModalOpen(false)}
      />
    </div>
  );
};

export default AdminPanel;
