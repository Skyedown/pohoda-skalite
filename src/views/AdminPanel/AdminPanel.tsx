import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  getAdminSettings,
  saveAdminSettings,
  WAIT_TIME_OPTIONS,
  formatWaitTime,
  type AdminSettings,
  type AnnouncementMode,
} from '../../utils/adminSettings';
import AdminOrderCreationModal from '../../components/AdminOrderCreation/AdminOrderCreationModal';
import './AdminPanel.less';

const AdminPanel: React.FC = () => {
  const [isOrderCreationModalOpen, setIsOrderCreationModalOpen] =
    useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    mode: 'off',
    waitTimeMinutes: 60,
    customNote:
      'Z dôvodu nepriaznivého počasia je donáška možná len k hlavnej ceste',
    disabledReason:
      'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
    disabledProductTypes: [],
    cardPaymentDeliveryEnabled: false,
    cardPaymentPickupEnabled: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Load settings from server
  useEffect(() => {
    const loadSettings = async () => {
      const loadedSettings = await getAdminSettings();
      if (loadedSettings.customNote === undefined) {
        loadedSettings.customNote =
          'Z dôvodu nepriaznivého počasia je donáška možná len k hlavnej ceste';
      }
      if (loadedSettings.disabledReason === undefined) {
        loadedSettings.disabledReason =
          'Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok. Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.';
      }
      if (loadedSettings.cardPaymentDeliveryEnabled === undefined) {
        loadedSettings.cardPaymentDeliveryEnabled = false;
      }
      if (loadedSettings.cardPaymentPickupEnabled === undefined) {
        loadedSettings.cardPaymentPickupEnabled = false;
      }
      setSettings(loadedSettings);
    };
    loadSettings();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/admin';
  };

  const handleModeChange = (mode: AnnouncementMode) => {
    setSettings({ ...settings, mode });
    setSaveSuccess(false);
  };

  const handleWaitTimeChange = (minutes: number) => {
    setSettings({ ...settings, waitTimeMinutes: minutes });
    setSaveSuccess(false);
  };

  const handleCustomNoteChange = (note: string) => {
    setSettings({ ...settings, customNote: note });
    setSaveSuccess(false);
  };

  const handleDisabledReasonChange = (reason: string) => {
    setSettings({ ...settings, disabledReason: reason });
    setSaveSuccess(false);
  };

  const handleProductTypeToggle = (
    productType: 'pizza' | 'burger' | 'langos' | 'sides',
  ) => {
    const currentDisabled = settings.disabledProductTypes || [];
    const isCurrentlyDisabled = currentDisabled.includes(productType);

    setSettings({
      ...settings,
      disabledProductTypes: isCurrentlyDisabled
        ? currentDisabled.filter((type) => type !== productType)
        : [...currentDisabled, productType],
    });
    setSaveSuccess(false);
  };

  const handleCardPaymentToggle = (type: 'delivery' | 'pickup') => {
    if (type === 'delivery') {
      setSettings({
        ...settings,
        cardPaymentDeliveryEnabled: !settings.cardPaymentDeliveryEnabled,
      });
    } else {
      setSettings({
        ...settings,
        cardPaymentPickupEnabled: !settings.cardPaymentPickupEnabled,
      });
    }
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaveSuccess(false);
    setSaveError('');

    console.log('🟡 Saving settings:', settings);
    console.log('🟡 disabledReason being sent:', settings.disabledReason);

    const savedSettings = await saveAdminSettings(settings);

    console.log('🟢 Received saved settings:', savedSettings);
    console.log(
      '🟢 disabledReason in response:',
      savedSettings?.disabledReason,
    );

    if (savedSettings) {
      // Update local state with what was actually saved to server
      setSettings(savedSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Set timestamp in localStorage to signal settings change
      localStorage.setItem('adminSettingsLastUpdate', Date.now().toString());

      // Dispatch custom event with the actual saved settings from server
      window.dispatchEvent(
        new CustomEvent('adminSettingsChanged', { detail: savedSettings }),
      );
    } else {
      setSaveError('Nepodarilo sa uložiť nastavenia. Skúste to znova.');
      setTimeout(() => setSaveError(''), 5000);
    }
  };

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
          {/* Quick Actions */}
          <div className="admin-panel__quick-actions">
            <button
              onClick={() => setIsOrderCreationModalOpen(true)}
              className="admin-panel__action-btn admin-panel__action-btn--order"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nová objednávka
            </button>
            <Link
              to="/admin/orders"
              className="admin-panel__action-btn admin-panel__action-btn--orders"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Predošlé objednávky
            </Link>
            <Link
              to="/admin/analytics"
              className="admin-panel__action-btn admin-panel__action-btn--analytics"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              Štatistiky
            </Link>
          </div>

          {/* Mode Selection */}
          <div className="admin-panel__section">
            <h2 className="admin-panel__section-title">Stav objednávok</h2>

            <div className="admin-panel__radio-group">
              <label className="admin-panel__radio">
                <input
                  type="radio"
                  name="mode"
                  value="off"
                  checked={settings.mode === 'off'}
                  onChange={() => handleModeChange('off')}
                />
                <div className="admin-panel__radio-content">
                  <span className="admin-panel__radio-label">
                    Bez obmedzení
                  </span>
                  <span className="admin-panel__radio-description">
                    Žiadne oznámenie, objednávky fungují normálne
                  </span>
                </div>
              </label>

              <label className="admin-panel__radio">
                <input
                  type="radio"
                  name="mode"
                  value="waitTime"
                  checked={settings.mode === 'waitTime'}
                  onChange={() => handleModeChange('waitTime')}
                />
                <div className="admin-panel__radio-content">
                  <span className="admin-panel__radio-label">Čakacia doba</span>
                  <span className="admin-panel__radio-description">
                    Informuje zákazníkov o dlhšej čakacej dobe
                  </span>
                </div>
              </label>

              <label className="admin-panel__radio">
                <input
                  type="radio"
                  name="mode"
                  value="disabled"
                  checked={settings.mode === 'disabled'}
                  onChange={() => handleModeChange('disabled')}
                />
                <div className="admin-panel__radio-content">
                  <span className="admin-panel__radio-label">Pozastavené</span>
                  <span className="admin-panel__radio-description">
                    Objednávky sú úplne pozastavené
                  </span>
                </div>
              </label>

              <label className="admin-panel__radio">
                <input
                  type="radio"
                  name="mode"
                  value="customNote"
                  checked={settings.mode === 'customNote'}
                  onChange={() => handleModeChange('customNote')}
                />
                <div className="admin-panel__radio-content">
                  <span className="admin-panel__radio-label">
                    Vlastná poznámka
                  </span>
                  <span className="admin-panel__radio-description">
                    Zobraziť vlastné oznámenie
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Wait Time Selection */}
          {settings.mode === 'waitTime' && (
            <div className="admin-panel__section">
              <h2 className="admin-panel__section-title">Čakacia doba</h2>

              <div className="admin-panel__select-group">
                <label htmlFor="waitTime">Výber čakacej doby:</label>
                <select
                  id="waitTime"
                  value={settings.waitTimeMinutes}
                  onChange={(e) => handleWaitTimeChange(Number(e.target.value))}
                  className="admin-panel__select"
                >
                  {WAIT_TIME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-panel__preview">
                <h3>Náhľad oznámenia:</h3>
                <p>
                  Z dôvodu veľkého počtu objednávok je čakacia doba momentálne
                  <strong>{formatWaitTime(settings.waitTimeMinutes)}</strong>.
                  Ďakujeme za pochopenie."
                </p>
              </div>
            </div>
          )}

          {/* Disabled Mode - Custom Reason */}
          {settings.mode === 'disabled' && (
            <div className="admin-panel__section">
              <h2 className="admin-panel__section-title">Dôvod pozastavenia</h2>

              <div className="admin-panel__textarea-group">
                <label htmlFor="disabledReason">Text oznámenia:</label>
                <textarea
                  id="disabledReason"
                  value={settings.disabledReason || ''}
                  onChange={(e) => handleDisabledReasonChange(e.target.value)}
                  className="admin-panel__textarea"
                  rows={4}
                  maxLength={500}
                  placeholder="Zadajte dôvod pozastavenia objednávok..."
                />
                <div className="admin-panel__char-counter">
                  {(settings.disabledReason || '').length} / 500 znakov
                </div>
              </div>

              <div className="admin-panel__preview">
                <h3>Náhľad oznámenia:</h3>
                <p>"{settings.disabledReason || ''}"</p>
              </div>
            </div>
          )}

          {/* Custom Note Input */}
          {settings.mode === 'customNote' && (
            <div className="admin-panel__section">
              <h2 className="admin-panel__section-title">Vlastná poznámka</h2>

              <div className="admin-panel__textarea-group">
                <label htmlFor="customNote">Text oznámenia:</label>
                <textarea
                  id="customNote"
                  value={settings.customNote || ''}
                  onChange={(e) => handleCustomNoteChange(e.target.value)}
                  className="admin-panel__textarea"
                  rows={4}
                  maxLength={500}
                  placeholder="Zadajte vlastné oznámenie pre zákazníkov..."
                />
                <div className="admin-panel__char-counter">
                  {(settings.customNote || '').length} / 500 znakov
                </div>
              </div>

              <div className="admin-panel__preview">
                <h3>Náhľad oznámenia:</h3>
                <p>"{settings.customNote || ''}"</p>
              </div>
            </div>
          )}

          {/* Product Availability */}
          <div className="admin-panel__section">
            <h2 className="admin-panel__section-title">Dostupnosť produktov</h2>
            <p className="admin-panel__section-description">
              Vypnite jednotlivé kategórie ak hľadáte vydané. Zákazníci budú
              vidieť oznámenie v baneri a nebudú môcť pridávať produkty do
              košíka.
            </p>

            <div className="admin-panel__checkbox-group">
              {(['pizza', 'burger', 'langos', 'sides'] as const).map(
                (productType) => {
                  const isDisabled = (
                    settings.disabledProductTypes || []
                  ).includes(productType);
                  const labels: Record<string, string> = {
                    pizza: 'Pizze',
                    burger: 'Burgre',
                    langos: 'Langoše',
                    sides: 'Prílohy',
                  };

                  return (
                    <label key={productType} className="admin-panel__checkbox">
                      <input
                        type="checkbox"
                        checked={isDisabled}
                        onChange={() => handleProductTypeToggle(productType)}
                        className="admin-panel__checkbox-input"
                      />
                      <div className="admin-panel__checkbox-content">
                        <span className="admin-panel__checkbox-label">
                          {isDisabled ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="admin-panel__checkbox-icon"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="admin-panel__checkbox-icon"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                          {labels[productType]} -{' '}
                          {isDisabled ? 'Vypnuté' : 'Dostupné'}
                        </span>
                      </div>
                    </label>
                  );
                },
              )}
            </div>
          </div>

          {/* Card Payment Availability */}
          <div className="admin-panel__section">
            <h2 className="admin-panel__section-title">Platba kartou</h2>
            <p className="admin-panel__section-description">
              Zapnite alebo vypnite možnosť platby kartou pre jednotlivé spôsoby
              donášky.
            </p>

            <div className="admin-panel__checkbox-group">
              <label className="admin-panel__checkbox">
                <input
                  type="checkbox"
                  checked={settings.cardPaymentDeliveryEnabled || false}
                  onChange={() => handleCardPaymentToggle('delivery')}
                  className="admin-panel__checkbox-input"
                />
                <div className="admin-panel__checkbox-content">
                  <span className="admin-panel__checkbox-label">
                    {settings.cardPaymentDeliveryEnabled ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="admin-panel__checkbox-icon"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="admin-panel__checkbox-icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    )}
                    Donáška - Platba kartou{' '}
                    {settings.cardPaymentDeliveryEnabled
                      ? 'Zapnutá'
                      : 'Vypnutá'}
                  </span>
                </div>
              </label>

              <label className="admin-panel__checkbox">
                <input
                  type="checkbox"
                  checked={settings.cardPaymentPickupEnabled || false}
                  onChange={() => handleCardPaymentToggle('pickup')}
                  className="admin-panel__checkbox-input"
                />
                <div className="admin-panel__checkbox-content">
                  <span className="admin-panel__checkbox-label">
                    {settings.cardPaymentPickupEnabled ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="admin-panel__checkbox-icon"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="admin-panel__checkbox-icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    )}
                    Osobný odber - Platba kartou{' '}
                    {settings.cardPaymentPickupEnabled ? 'Zapnutá' : 'Vypnutá'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="admin-panel__actions">
            <button
              onClick={handleSave}
              className="admin-panel__button admin-panel__button--primary"
            >
              Uložiť zmeny
            </button>

            {saveSuccess && (
              <div className="admin-panel__success">
                ✓ Zmeny boli úspešne uložené
              </div>
            )}

            {saveError && (
              <div className="admin-panel__error-message">✗ {saveError}</div>
            )}
          </div>

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
