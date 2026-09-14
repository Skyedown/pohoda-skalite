import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  getAdminSettings,
  saveAdminSettings,
  DEFAULT_SETTINGS,
  type AdminSettings,
  type DeliveryCity,
} from '../../utils/adminSettings';
import { AdminDeliveryCityList } from '../../components/AdminPanel/AdminDeliveryCityList/AdminDeliveryCityList';
import { AdminSaveActions } from '../../components/AdminPanel/AdminSaveActions/AdminSaveActions';
import '../AdminPanel/AdminPanel.less';

const AdminDeliveryAreas: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      setSettings(await getAdminSettings());
    };
    loadSettings();
  }, []);

  const handleSkChange = useCallback((sk: DeliveryCity[]) => {
    setSettings((prev) => ({
      ...prev,
      deliveryCities: { ...prev.deliveryCities, sk },
    }));
    setSaveSuccess(false);
  }, []);

  const handlePlChange = useCallback((pl: DeliveryCity[]) => {
    setSettings((prev) => ({
      ...prev,
      deliveryCities: { ...prev.deliveryCities, pl },
    }));
    setSaveSuccess(false);
  }, []);

  const handleSave = useCallback(async () => {
    setSaveSuccess(false);
    setSaveError('');

    const hasBlankName = [
      ...settings.deliveryCities.sk,
      ...settings.deliveryCities.pl,
    ].some((city) => !city.name.trim());

    if (hasBlankName) {
      setSaveError('Každá obec musí mať vyplnený názov.');
      return;
    }

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
        <title>Rozvozové oblasti | Admin Panel | Pohoda Skalité</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-panel__container">
        <div className="admin-panel__header">
          <h1 className="admin-panel__title">Rozvozové oblasti</h1>
          <Link to="/admin" className="admin-panel__logout">
            ← Hlavná stránka
          </Link>
        </div>

        <div className="admin-panel__content">
          <div className="admin-panel__section">
            <h2 className="admin-panel__section-title">
              Obce a minimálne sumy
            </h2>
            <p className="admin-panel__section-description">
              Zoznam sa používa v košíku, vo výbere obce aj v sekcii Donáška na
              hlavnej stránke. Slovenské sumy sú v eurách, poľské v zlotých.
              Poplatok 0 znamená donáška zadarmo.
            </p>

            <AdminDeliveryCityList
              title="Slovensko — pizzapohoda.sk"
              flag="🇸🇰"
              currency="EUR"
              cities={settings.deliveryCities.sk}
              onChange={handleSkChange}
            />

            <AdminDeliveryCityList
              title="Poľsko — pizzapohoda.pl"
              flag="🇵🇱"
              currency="PLN"
              cities={settings.deliveryCities.pl}
              onChange={handlePlChange}
            />
          </div>

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

export default AdminDeliveryAreas;
