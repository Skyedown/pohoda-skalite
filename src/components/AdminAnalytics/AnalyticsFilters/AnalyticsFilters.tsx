import React from 'react';
import './AnalyticsFilters.less';

export type ProductCategory = 'all' | 'pizza' | 'burger' | 'langos' | 'sides';
export type DeliveryMethodFilter =
  | 'all'
  | 'pickup'
  | 'dine-in'
  | 'delivery'
  | 'pickup,delivery';

const PRODUCT_CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'all', label: 'Všetky' },
  { value: 'pizza', label: 'Pizze' },
  { value: 'burger', label: 'Burgre' },
  { value: 'langos', label: 'Langoše' },
  { value: 'sides', label: 'Prílohy' },
];

const DELIVERY_METHOD_OPTIONS: {
  value: DeliveryMethodFilter;
  label: string;
}[] = [
  { value: 'all', label: 'Všetky' },
  { value: 'pickup', label: 'Osobný odber' },
  { value: 'dine-in', label: 'Prevádzka' },
  { value: 'delivery', label: 'Dovoz' },
  { value: 'pickup,delivery', label: 'Osobný odber + Dovoz' },
];

interface AnalyticsFiltersProps {
  productCategory: ProductCategory;
  deliveryMethod: DeliveryMethodFilter;
  onProductCategoryChange: (category: ProductCategory) => void;
  onDeliveryMethodChange: (method: DeliveryMethodFilter) => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  productCategory,
  deliveryMethod,
  onProductCategoryChange,
  onDeliveryMethodChange,
}) => {
  return (
    <div className="analytics-filters">
      <div className="analytics-filters__group">
        <span className="analytics-filters__label">Kategória produktov</span>
        <div className="analytics-filters__tiles">
          {PRODUCT_CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={productCategory === opt.value ? 'active' : ''}
              onClick={() => onProductCategoryChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="analytics-filters__group">
        <span className="analytics-filters__label">Spôsob objednávky</span>
        <div className="analytics-filters__tiles">
          {DELIVERY_METHOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={deliveryMethod === opt.value ? 'active' : ''}
              onClick={() => onDeliveryMethodChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
