import React from 'react';
import { StatusToggleIcon } from '../StatusToggleIcon/StatusToggleIcon';

interface AdminCustomNoteOrderingProps {
  enabled: boolean;
  onToggle: () => void;
}

export const AdminCustomNoteOrdering: React.FC<
  AdminCustomNoteOrderingProps
> = ({ enabled, onToggle }) => {
  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">
        Objednávanie počas oznámenia
      </h2>
      <p className="admin-panel__section-description">
        Zapnite pri promo akciách a informačných oznámeniach. Vypnite, ak chcete
        objednávky pozastaviť.
      </p>
      <div className="admin-panel__checkbox-group">
        <label className="admin-panel__checkbox">
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggle}
            className="admin-panel__checkbox-input"
          />
          <div className="admin-panel__checkbox-content">
            <span className="admin-panel__checkbox-label">
              <StatusToggleIcon enabled={enabled} />
              Objednávanie {enabled ? 'zapnuté' : 'vypnuté'}
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};
