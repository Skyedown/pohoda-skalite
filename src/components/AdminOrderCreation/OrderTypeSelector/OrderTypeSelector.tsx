import React from 'react';
import './OrderTypeSelector.less';

interface OrderTypeSelectorProps {
  value: 'dine-in' | 'customer';
  onChange: (value: 'dine-in' | 'customer') => void;
}

const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="order-type-selector">
      {' '}
      <label className="order-type-selector__option">
        <input
          type="radio"
          name="orderType"
          value="customer"
          checked={value === 'customer'}
          onChange={(e) => onChange(e.target.value as 'customer')}
        />
        <div className="order-type-selector__content">
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
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span className="order-type-selector__label">
            Objednávka so zákazníckymi údajmi
          </span>
        </div>
      </label>
      <label className="order-type-selector__option">
        <input
          type="radio"
          name="orderType"
          value="dine-in"
          checked={value === 'dine-in'}
          onChange={(e) => onChange(e.target.value as 'dine-in')}
        />
        <div className="order-type-selector__content">
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
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          <span className="order-type-selector__label">
            Konzumácia v reštaurácii
          </span>
        </div>
      </label>
    </div>
  );
};

export default OrderTypeSelector;
