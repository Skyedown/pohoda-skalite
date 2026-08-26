import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettings,
} from '../../utils/adminSettings';
import { AdminProductAvailability } from '../../components/AdminPanel/AdminProductAvailability/AdminProductAvailability';
import { AdminProductItemAvailability } from '../../components/AdminPanel/AdminProductItemAvailability/AdminProductItemAvailability';
import { AdminSaveActions } from '../../components/AdminPanel/AdminSaveActions/AdminSaveActions';
import {
  DEFAULT_SETTINGS,
  type ProductType,
} from '../../components/AdminPanel/adminPanelHelpers';
import '../AdminPanel/AdminPanel.less';

const AdminProductRestrictions: React.FC = () => {
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

  const handleProductTypeToggle = useCallback((productType: ProductType) => {
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
  }, []);

  const handleProductIdToggle = useCallback((productId: string) => {
    setSettings((prev) => {
      const current = prev.disabledProductIds || [];
      const isDisabled = current.includes(productId);
      return {
        ...prev,
        disabledProductIds: isDisabled
          ? current.filter((id) => id !== productId)
          : [...current, productId],
      };
    });
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
        <title>Dostupnosť produktov | Admin Panel | Pohoda Skalite</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-panel__container">
        <div className="admin-panel__header">
          <h1 className="admin-panel__title">Dostupnosť produktov</h1>
          <Link to="/admin" className="admin-panel__logout">
            ← Hlavná stránka
          </Link>
        </div>

        <div className="admin-panel__content">
          <AdminProductAvailability
            disabledProductTypes={settings.disabledProductTypes || []}
            onToggle={handleProductTypeToggle}
          />

          <AdminProductItemAvailability
            disabledProductIds={settings.disabledProductIds || []}
            onToggle={handleProductIdToggle}
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

export default AdminProductRestrictions;
