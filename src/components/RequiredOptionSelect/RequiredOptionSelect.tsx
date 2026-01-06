import React from 'react';
import type { RequiredOption } from '../../types';
import './RequiredOptionSelect.less';

interface RequiredOptionSelectProps {
  requiredOption: RequiredOption;
  selectedValue: string;
  onChange: (value: string) => void;
}

const RequiredOptionSelect: React.FC<RequiredOptionSelectProps> = ({
  requiredOption,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="required-option-select">
      <h3 className="required-option-select__title">
        {requiredOption.label} <span className="required-option-select__asterisk">*</span>
      </h3>
      <div className="required-option-select__options">
        {requiredOption.options.map((option) => (
          <label
            key={option.id}
            className={`required-option-select__option ${
              selectedValue === option.id ? 'required-option-select__option--selected' : ''
            }`}
          >
            <input
              type="radio"
              name={requiredOption.name}
              value={option.id}
              checked={selectedValue === option.id}
              onChange={() => onChange(option.id)}
              className="required-option-select__radio"
            />
            <span className="required-option-select__radio-custom"></span>
            <span className="required-option-select__label">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RequiredOptionSelect;
