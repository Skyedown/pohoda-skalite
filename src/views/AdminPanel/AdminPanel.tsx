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
import './AdminPanel.less';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [settings, setSettings] = useState<AdminSettings>({
    mode: 'off',
    waitTimeMinutes: 60,
    customNote:
      'Z dôvodu nepriaznivého počasia je donáška možná len k hlavnej ceste',
    disabledProductTypes: [],
    cardPaymentDeliveryEnabled: false,
    cardPaymentPickupEnabled: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Check if already authenticated in this session
  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load settings from server when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadSettings = async () => {
        const loadedSettings = await getAdminSettings();
        // Ensure customNote exists (for backward compatibility)
        if (!loadedSettings.customNote) {
          loadedSettings.customNote =
            'Z dôvodu nepriaznivého počasia je donáška možná len k hlavnej ceste';
        }
        // Ensure card flags default to false if missing
        if (loadedSettings.cardPaymentDeliveryEnabled === undefined) {
          loadedSettings.cardPaymentDeliveryEnabled = false;
        }
        if (loadedSettings.cardPaymentPickupEnabled === undefined) {
          loadedSettings.cardPaymentPickupEnabled = false;
        }
        setSettings(loadedSettings);
      };
      loadSettings();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Check credentials from .env
    const validUsername = import.meta.env.VITE_ADMIN_NAME || 'admin';
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Nesprávne prihlasovacie údaje');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setUsername('');
    setPassword('');
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

    const success = await saveAdminSettings(settings);

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Dispatch custom event to notify other components
      window.dispatchEvent(
        new CustomEvent('adminSettingsChanged', { detail: settings }),
      );
    } else {
      setSaveError('Nepodarilo sa uložiť nastavenia. Skúste to znova.');
      setTimeout(() => setSaveError(''), 5000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        <Helmet>
          <title>Admin Panel | Pohoda Skalite</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="admin-panel__login">
          <div className="admin-panel__login-box">
            <h1 className="admin-panel__title">Admin Panel</h1>
            <p className="admin-panel__subtitle">Zadajte prihlasovacie údaje</p>

            <form onSubmit={handleLogin} className="admin-panel__login-form">
              <div className="admin-panel__input-group">
                <label htmlFor="username">Používateľské meno</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Zadajte používateľské meno"
                  autoFocus
                />
              </div>

              <div className="admin-panel__input-group">
                <label htmlFor="password">Heslo</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Zadajte heslo"
                />
                {passwordError && (
                  <span className="admin-panel__error">{passwordError}</span>
                )}
              </div>

              <button
                type="submit"
                className="admin-panel__button admin-panel__button--primary"
              >
                Prihlásiť sa
              </button>

              <Link to="/" className="admin-panel__back-link">
                ← Späť na hlavnú stránku
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
                    pizza: 'Pizzy',
                    burger: 'Burgery',
                    langos: 'Langoš',
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
    </div>
  );
};

export default AdminPanel;
