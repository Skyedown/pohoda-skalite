import React, { useState, useCallback } from 'react';
import type { ProductStat } from '../ProductPerformance/ProductPerformance';
import { computeProductTypeSummaries } from '../OrderStats.helpers';
import { ProductSummaryCards } from '../ProductSummaryCards/ProductSummaryCards';
import { ProductPerformance } from '../ProductPerformance/ProductPerformance';
import { prilohy } from '../../../data/prilohy';
import './ProductsTab.less';

type ProductCategory =
  | 'all'
  | 'pizza'
  | 'burger'
  | 'langos'
  | 'fries'
  | 'sauces';

const SAUCE_IDS: ReadonlySet<string> = new Set(
  prilohy.filter((p) => p.weight?.includes('ml')).map((p) => p.id),
);

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'all', label: 'Všetky' },
  { value: 'pizza', label: 'Pizze' },
  { value: 'burger', label: 'Burgre' },
  { value: 'langos', label: 'Langoše' },
  { value: 'fries', label: 'Hranolky' },
  { value: 'sauces', label: 'Omáčky' },
];

interface ProductsTabProps {
  productStats: ProductStat[];
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ productStats }) => {
  const [category, setCategory] = useState<ProductCategory>('all');

  const typeSummaries = computeProductTypeSummaries(productStats);

  const filteredStats =
    category === 'all'
      ? productStats
      : category === 'fries'
        ? productStats.filter(
            (s) => s.type === 'sides' && !SAUCE_IDS.has(s._id),
          )
        : category === 'sauces'
          ? productStats.filter(
              (s) => s.type === 'sides' && SAUCE_IDS.has(s._id),
            )
          : productStats.filter((s) => s.type === category);

  const handleCategoryChange = useCallback(
    (value: ProductCategory) => setCategory(value),
    [],
  );

  return (
    <div className="products-tab">
      <ProductSummaryCards summaries={typeSummaries} />

      <div className="products-tab__filter-group">
        <span className="products-tab__filter-label">
          Filtrovať grafy podľa kategórie
        </span>
        <div className="products-tab__filter-tiles">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={category === opt.value ? 'active' : ''}
              onClick={() => handleCategoryChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <ProductPerformance stats={filteredStats} />
    </div>
  );
};
