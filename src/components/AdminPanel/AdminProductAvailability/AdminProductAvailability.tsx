import React, { useCallback } from 'react';
import { StatusToggleIcon } from '../StatusToggleIcon/StatusToggleIcon';
import {
  type ProductType,
  PRODUCT_TYPES,
  PRODUCT_LABELS,
} from '../adminPanelHelpers';
import './AdminProductAvailability.less';

interface AdminProductAvailabilityProps {
  disabledProductTypes: ProductType[];
  onToggle: (productType: ProductType) => void;
}

export const AdminProductAvailability: React.FC<
  AdminProductAvailabilityProps
> = ({ disabledProductTypes, onToggle }) => {
  const handleToggle = useCallback(
    (productType: ProductType) => () => onToggle(productType),
    [onToggle],
  );

  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">Dostupnosť produktov</h2>
      <p className="admin-panel__section-description">
        Vypnite jednotlivé kategórie ak hľadáte vydané. Zákazníci budú vidieť
        oznámenie v baneri a nebudú môcť pridávať produkty do košíka.
      </p>
      <div className="admin-panel__checkbox-group">
        {PRODUCT_TYPES.map((productType) => {
          const isDisabled = disabledProductTypes.includes(productType);
          return (
            <label key={productType} className="admin-panel__checkbox">
              <input
                type="checkbox"
                checked={isDisabled}
                onChange={handleToggle(productType)}
                className="admin-panel__checkbox-input"
              />
              <div className="admin-panel__checkbox-content">
                <span className="admin-panel__checkbox-label">
                  <StatusToggleIcon enabled={isDisabled} />
                  {PRODUCT_LABELS[productType]} -{' '}
                  {isDisabled ? 'Vypnuté' : 'Dostupné'}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
