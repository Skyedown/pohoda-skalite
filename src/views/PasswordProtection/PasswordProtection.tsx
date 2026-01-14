import React, { useState } from 'react';
import './PasswordProtection.less';

interface PasswordProtectionProps {
  onUnlock: () => void;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const correctPassword = import.meta.env.VITE_SITE_PASSWORD || 'Lenajemantak1';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      sessionStorage.setItem('siteUnlocked', 'true');
      onUnlock();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="password-protection">
      <div className="password-protection__pizza">
        <img src="/images/large-hero-pizza.png" alt="Pizza" />
      </div>

      <div className="password-protection__content">
        <h1 className="password-protection__title">
          Pečieme pre Vás novú webstránku!
        </h1>

        <p className="password-protection__subtitle">
          Pre viac informácií sledujte náš Instagram a Facebook
        </p>

        <div className="password-protection__social">
          <a
            href="https://www.instagram.com/pizzapohoda.sk?igsh=MWZieWI2bWRkaGFqYg%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="password-protection__social-link"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61585409280116"
            target="_blank"
            rel="noopener noreferrer"
            className="password-protection__social-link"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>

        <form onSubmit={handleSubmit} className="password-protection__form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Zadajte heslo"
            className={`password-protection__input ${error ? 'password-protection__input--error' : ''}`}
          />
          <button type="submit" className="password-protection__button">
            Vstúpiť
          </button>
        </form>

        {error && (
          <p className="password-protection__error">Nesprávne heslo</p>
        )}
      </div>
    </div>
  );
};

export default PasswordProtection;
