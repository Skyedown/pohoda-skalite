import React from 'react';
import type { AnnouncementMode } from '../../../utils/adminSettings';
import { MODES } from '../adminPanelHelpers';
import './AdminModeSelector.less';

interface AdminModeSelectorProps {
  mode: AnnouncementMode;
  onChange: (mode: AnnouncementMode) => void;
}

export const AdminModeSelector: React.FC<AdminModeSelectorProps> = ({
  mode,
  onChange,
}) => {
  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">Stav objednávok</h2>
      <div className="admin-panel__radio-group">
        {MODES.map((item) => (
          <label key={item.value} className="admin-panel__radio">
            <input
              type="radio"
              name="mode"
              value={item.value}
              checked={mode === item.value}
              onChange={() => onChange(item.value)}
            />
            <div className="admin-panel__radio-content">
              <span className="admin-panel__radio-label">{item.label}</span>
              <span className="admin-panel__radio-description">
                {item.description}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
