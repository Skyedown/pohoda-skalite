import React from 'react';

interface CookieCategoryProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  /** Necessary cookies show as on and cannot be switched off. */
  lockedLabel?: string;
  onChange?: (checked: boolean) => void;
}

export const CookieCategory: React.FC<CookieCategoryProps> = ({
  id,
  title,
  description,
  checked,
  lockedLabel,
  onChange,
}) => {
  const inputId = `cookie-category-${id}`;
  const descriptionId = `${inputId}-description`;

  return (
    <div className="cookie-category">
      <div className="cookie-category__header">
        <label htmlFor={inputId} className="cookie-category__title">
          {title}
        </label>
        {lockedLabel ? (
          <span className="cookie-category__locked">{lockedLabel}</span>
        ) : (
          <input
            id={inputId}
            type="checkbox"
            role="switch"
            className="cookie-category__switch"
            checked={checked}
            aria-describedby={descriptionId}
            onChange={(event) => onChange?.(event.target.checked)}
          />
        )}
      </div>
      <p id={descriptionId} className="cookie-category__description">
        {description}
      </p>
    </div>
  );
};
