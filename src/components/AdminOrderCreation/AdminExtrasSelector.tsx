import React from 'react';
import type { LocalizedExtra } from '../../types';
import { formatPrice } from '../../i18n/format';
import './AdminExtrasSelector.less';

interface AdminExtrasSelectorProps {
  extras: LocalizedExtra[];
  selectedExtras: string[];
  onToggleExtra: (extraId: string) => void;
}

const AdminExtrasSelector: React.FC<AdminExtrasSelectorProps> = ({
  extras,
  selectedExtras,
  onToggleExtra,
}) => {
  const extrasPrice = selectedExtras.reduce((sum, extraId) => {
    const extra = extras.find((e) => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);

  return (
    <div className="admin-extras-selector">
      <div className="admin-extras-selector__header">
        <h3 className="admin-extras-selector__title">Pridať extra prílohy</h3>
        <p className="admin-extras-selector__description">
          Vyberte dodatočné prílohy k produktu
        </p>
      </div>

      <div className="admin-extras-selector__list">
        {extras.length > 0 ? (
          extras.map((extra) => {
            const isSelected = selectedExtras.includes(extra.id);
            return (
              <label
                key={extra.id}
                className={`admin-extras-selector__item ${
                  isSelected ? 'admin-extras-selector__item--selected' : ''
                }`}
              >
                <div className="admin-extras-selector__checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleExtra(extra.id)}
                    className="admin-extras-selector__checkbox"
                  />
                  <span className="admin-extras-selector__checkbox-custom">
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="admin-extras-selector__label">
                    {extra.name}
                  </span>
                </div>
                <span className="admin-extras-selector__price">
                  +{formatPrice(extra.price, 'EUR')}
                </span>
              </label>
            );
          })
        ) : (
          <p className="admin-extras-selector__empty">
            Žiadne dostupné prílohy
          </p>
        )}
      </div>

      {selectedExtras.length > 0 && (
        <div className="admin-extras-selector__summary">
          <p className="admin-extras-selector__summary-text">
            Suma príloh: <strong>{formatPrice(extrasPrice, 'EUR')}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminExtrasSelector;
