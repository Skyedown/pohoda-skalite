import React from 'react';
import './Input.less';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'input__field',
    error ? 'input__field--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    'input',
    fullWidth ? 'input--full-width' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {label && <label className="input__label">{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <span className="input__error">{error}</span>}
    </div>
  );
};

export default Input;
