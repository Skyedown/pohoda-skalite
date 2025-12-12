import React from 'react';
import './PaymentMethodSelector.less';

interface PaymentMethodSelectorProps {
  value: 'cash' | 'card';
  onChange: (value: 'cash' | 'card') => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="payment-method">
      <h3 className="payment-method__title">Spôsob platby</h3>

      <label className="payment-method__option">
        <div className="payment-method__radio">
          <input
            type="radio"
            name="payment"
            checked={value === 'cash'}
            onChange={() => onChange('cash')}
          />
          <span className="payment-method__radio-custom"></span>
        </div>
        <div className="payment-method__content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <circle cx="12" cy="12" r="2"/>
            <path d="M6 12h.01M18 12h.01"/>
          </svg>
          <span>Hotovosť pri dodaní</span>
        </div>
      </label>

      <label className="payment-method__option">
        <div className="payment-method__radio">
          <input
            type="radio"
            name="payment"
            checked={value === 'card'}
            onChange={() => onChange('card')}
          />
          <span className="payment-method__radio-custom"></span>
        </div>
        <div className="payment-method__content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <span>Karta pri dodaní</span>
        </div>
      </label>
    </div>
  );
};

export default PaymentMethodSelector;
