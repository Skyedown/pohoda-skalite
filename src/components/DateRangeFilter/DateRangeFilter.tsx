import React from 'react';
import './DateRangeFilter.less';

export type DatePreset =
  | 'today'
  | 'yesterday'
  | '7d'
  | '14d'
  | '30d'
  | '90d'
  | 'this-month'
  | 'last-month';

export const formatDateParam = (d: Date): string =>
  d.toISOString().split('T')[0];

interface DateRangeFilterProps {
  fromDate: string;
  toDate: string;
  activePreset: string | null;
  presets?: DatePreset[];
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onPresetChange: (preset: string, from: string, to: string) => void;
  idPrefix?: string;
}

const presetLabels: Record<DatePreset, string> = {
  today: 'Dnes',
  yesterday: 'Včera',
  '7d': '7 dní',
  '14d': '14 dní',
  '30d': '30 dní',
  '90d': '90 dní',
  'this-month': 'Tento mesiac',
  'last-month': 'Minulý mesiac',
};

export function computePresetRange(preset: string): {
  from: string;
  to: string;
} {
  const now = new Date();
  let from: Date = new Date(now);
  let to: Date = new Date(now);

  switch (preset) {
    case 'today':
      break;
    case 'yesterday':
      from.setDate(from.getDate() - 1);
      to = new Date(from);
      break;
    case '7d':
      from.setDate(from.getDate() - 6);
      break;
    case '14d':
      from.setDate(from.getDate() - 13);
      break;
    case '30d':
      from.setDate(from.getDate() - 29);
      break;
    case '90d':
      from.setDate(from.getDate() - 89);
      break;
    case 'this-month':
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'last-month':
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
  }

  return { from: formatDateParam(from), to: formatDateParam(to) };
}

const defaultPresets: DatePreset[] = [
  'today',
  'yesterday',
  '7d',
  '14d',
  '30d',
  '90d',
  'this-month',
  'last-month',
];

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  fromDate,
  toDate,
  activePreset,
  presets = defaultPresets,
  onFromChange,
  onToChange,
  onPresetChange,
  idPrefix = 'date',
}) => {
  const handlePreset = (preset: string) => {
    const { from, to } = computePresetRange(preset);
    onPresetChange(preset, from, to);
  };

  return (
    <div className="date-range-filter">
      <div className="date-range-filter__presets">
        {presets.map((preset) => (
          <button
            key={preset}
            className={activePreset === preset ? 'active' : ''}
            onClick={() => handlePreset(preset)}
          >
            {presetLabels[preset]}
          </button>
        ))}
      </div>
      <div className="date-range-filter__inputs">
        <div className="date-range-filter__field">
          <label htmlFor={`${idPrefix}-from`}>Od:</label>
          <input
            type="date"
            id={`${idPrefix}-from`}
            value={fromDate}
            onChange={(e) => onFromChange(e.target.value)}
            max={toDate}
          />
        </div>
        <div className="date-range-filter__field">
          <label htmlFor={`${idPrefix}-to`}>Do:</label>
          <input
            type="date"
            id={`${idPrefix}-to`}
            value={toDate}
            onChange={(e) => onToChange(e.target.value)}
            min={fromDate}
            max={formatDateParam(new Date())}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;
