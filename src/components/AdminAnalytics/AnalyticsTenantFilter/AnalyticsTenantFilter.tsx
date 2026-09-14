import React from 'react';
import type { Locale } from '../../../i18n/types';
import './AnalyticsTenantFilter.less';

const TENANT_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: 'sk', label: 'Slovensko (EUR)', flag: '🇸🇰' },
  { value: 'pl', label: 'Poľsko (PLN)', flag: '🇵🇱' },
];

interface AnalyticsTenantFilterProps {
  tenant: Locale;
  onChange: (tenant: Locale) => void;
}

export const AnalyticsTenantFilter: React.FC<AnalyticsTenantFilterProps> = ({
  tenant,
  onChange,
}) => (
  <div className="analytics-tenant-filter">
    <span className="analytics-tenant-filter__label">Web</span>
    <div className="analytics-tenant-filter__tiles">
      {TENANT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={tenant === opt.value ? 'active' : ''}
          onClick={() => onChange(opt.value)}
        >
          <span aria-hidden="true">{opt.flag}</span> {opt.label}
        </button>
      ))}
    </div>
    <p className="analytics-tenant-filter__hint">
      Meny sa nesčítavajú — každý web má vlastné čísla.
    </p>
  </div>
);
