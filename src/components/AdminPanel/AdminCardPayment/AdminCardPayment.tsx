import React from 'react';
import { StatusToggleIcon } from '../StatusToggleIcon/StatusToggleIcon';
import './AdminCardPayment.less';

interface AdminCardPaymentProps {
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  onToggle: (type: 'delivery' | 'pickup') => void;
}

export const AdminCardPayment: React.FC<AdminCardPaymentProps> = ({
  deliveryEnabled,
  pickupEnabled,
  onToggle,
}) => {
  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">Platba kartou</h2>
      <p className="admin-panel__section-description">
        Zapnite alebo vypnite možnosť platby kartou pre jednotlivé spôsoby
        donášky.
      </p>
      <div className="admin-panel__checkbox-group">
        <label className="admin-panel__checkbox">
          <input
            type="checkbox"
            checked={deliveryEnabled}
            onChange={() => onToggle('delivery')}
            className="admin-panel__checkbox-input"
          />
          <div className="admin-panel__checkbox-content">
            <span className="admin-panel__checkbox-label">
              <StatusToggleIcon enabled={deliveryEnabled} />
              Donáška - Platba kartou {deliveryEnabled ? 'Zapnutá' : 'Vypnutá'}
            </span>
          </div>
        </label>
        <label className="admin-panel__checkbox">
          <input
            type="checkbox"
            checked={pickupEnabled}
            onChange={() => onToggle('pickup')}
            className="admin-panel__checkbox-input"
          />
          <div className="admin-panel__checkbox-content">
            <span className="admin-panel__checkbox-label">
              <StatusToggleIcon enabled={pickupEnabled} />
              Osobný odber - Platba kartou{' '}
              {pickupEnabled ? 'Zapnutá' : 'Vypnutá'}
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};
