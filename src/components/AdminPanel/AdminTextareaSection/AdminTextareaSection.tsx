import React from 'react';
import './AdminTextareaSection.less';

interface AdminTextareaSectionProps {
  id: string;
  title: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const AdminTextareaSection: React.FC<AdminTextareaSectionProps> = ({
  id,
  title,
  label,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">{title}</h2>
      <div className="admin-panel__textarea-group">
        <label htmlFor={id}>{label}</label>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-panel__textarea"
          rows={4}
          maxLength={500}
          placeholder={placeholder}
        />
        <div className="admin-panel__char-counter">
          {value.length} / 500 znakov
        </div>
      </div>
      <div className="admin-panel__preview">
        <h3>Náhľad oznámenia:</h3>
        <p>"{value}"</p>
      </div>
    </div>
  );
};
