import React from 'react';
import './Select.less';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: SelectOption[];
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  fullWidth = false,
  options,
  className = '',
  ...props
}) => {
  const selectClasses = [
    'select__field',
    error ? 'select__field--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    'select',
    fullWidth ? 'select--full-width' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {label && <label className="select__label">{label}</label>}
      <select className={selectClasses} {...props}>
        <option value="">Vyberte...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select__error">{error}</span>}
    </div>
  );
};

export default Select;
