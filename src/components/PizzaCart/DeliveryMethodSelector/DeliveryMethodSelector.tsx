import React from 'react';
import type { DeliveryMethod } from '../../../types';

interface DeliveryMethodSelectorProps {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
}

export const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  value,
  onChange,
}) => (
  <div className="delivery-method">
    <h4 className="delivery-method__subtitle">Spôsob prevzatia</h4>

    <label className="delivery-method__option">
      <div className="delivery-method__radio">
        <input
          type="radio"
          name="deliveryMethod"
          checked={value === 'delivery'}
          onChange={() => onChange('delivery')}
        />
        <span className="delivery-method__radio-custom"></span>
      </div>
      <div className="delivery-method__content">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="1" y="3" width="15" height="13" />
          <path d="M16 8h5l3 3v5h-2m-4 0H2" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span>Donáška</span>
      </div>
    </label>

    <label className="delivery-method__option">
      <div className="delivery-method__radio">
        <input
          type="radio"
          name="deliveryMethod"
          checked={value === 'pickup'}
          onChange={() => onChange('pickup')}
        />
        <span className="delivery-method__radio-custom"></span>
      </div>
      <div className="delivery-method__content">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Vyzdvihnutie v reštaurácii</span>
      </div>
    </label>
  </div>
);
