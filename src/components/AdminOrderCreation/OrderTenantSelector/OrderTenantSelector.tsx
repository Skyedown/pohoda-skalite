import React from 'react';
import type { Locale } from '../../../i18n/types';
import './OrderTenantSelector.less';

const OPTIONS: { value: Locale; flag: string; label: string }[] = [
  { value: 'sk', flag: '🇸🇰', label: 'Slovensko' },
  { value: 'pl', flag: '🇵🇱', label: 'Poľsko' },
];

interface OrderTenantSelectorProps {
  value: Locale;
  onChange: (tenant: Locale) => void;
}

/**
 * Decides which delivery area the order belongs to. The village list, the
 * delivery fee and whether a street is asked for all follow from it, straight
 * out of the admin settings.
 */
export const OrderTenantSelector: React.FC<OrderTenantSelectorProps> = ({
  value,
  onChange,
}) => (
  <div className="order-tenant-selector">
    {OPTIONS.map((option) => (
      <label className="order-tenant-selector__option" key={option.value}>
        <input
          type="radio"
          name="orderTenant"
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        />
        <span className="order-tenant-selector__content">
          <span aria-hidden="true">{option.flag}</span>
          <span className="order-tenant-selector__label">{option.label}</span>
        </span>
      </label>
    ))}
  </div>
);
