import React, { useCallback, useMemo } from 'react';
import { PRODUCT_TYPES, PRODUCT_LABELS } from '../adminPanelHelpers';
import { pizzas } from '../../../data/pizzas';
import { burgers } from '../../../data/burgers';
import { langos } from '../../../data/langos';
import { prilohy } from '../../../data/prilohy';
import { capovane } from '../../../data/capovane';
import { drinks } from '../../../data/drinks';
import { snacks } from '../../../data/snacks';
import type { Product, ProductType } from '../../../types';
import './AdminProductItemAvailability.less';

interface AdminProductItemAvailabilityProps {
  disabledProductIds: string[];
  onToggle: (productId: string) => void;
}

export const AdminProductItemAvailability: React.FC<
  AdminProductItemAvailabilityProps
> = ({ disabledProductIds, onToggle }) => {
  const productsByCategory = useMemo<Record<ProductType, Product[]>>(
    () => ({
      pizza: pizzas,
      burger: burgers,
      langos: langos,
      sides: prilohy,
      capovane,
      drinks,
      snacks,
    }),
    [],
  );

  const handleToggle = useCallback(
    (productId: string) => () => onToggle(productId),
    [onToggle],
  );

  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">
        Dostupnosť jednotlivých produktov
      </h2>
      <p className="admin-panel__section-description">
        Prepínač zapnutý = produkt je dostupný. Vypnite konkrétny produkt, ak
        práve došiel. Vypnutý produkt si zákazník nemôže pridať do košíka a nedá
        sa pridať ani do objednávky v admine.
      </p>
      <div className="admin-item-availability">
        {PRODUCT_TYPES.map((category) => (
          <div key={category} className="admin-item-availability__category">
            <h3 className="admin-item-availability__category-title">
              {PRODUCT_LABELS[category]}
            </h3>
            <div className="admin-item-availability__grid">
              {productsByCategory[category].map((product) => {
                const isAvailable = !disabledProductIds.includes(product.id);
                return (
                  <label
                    key={product.id}
                    className="admin-item-availability__item"
                  >
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={handleToggle(product.id)}
                      className="admin-item-availability__input"
                    />
                    <span className="admin-item-availability__name">
                      {product.name}
                    </span>
                    <span className="admin-item-availability__control">
                      <span className="admin-item-availability__switch" />
                      <span className="admin-item-availability__state">
                        {isAvailable ? 'Dostupné' : 'Vypnuté'}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
