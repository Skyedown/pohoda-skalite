import React from 'react';
import type { ProductTypeSummary } from '../OrderStats.helpers';
import './ProductSummaryCards.less';

interface ProductSummaryCardsProps {
  summaries: ProductTypeSummary[];
}

export const ProductSummaryCards: React.FC<ProductSummaryCardsProps> = ({
  summaries,
}) => {
  return (
    <div className="product-summary-cards">
      {summaries.map((summary) => (
        <div
          key={summary.key}
          className={`product-summary-cards__card product-summary-cards__card--${summary.key}`}
        >
          <p className="product-summary-cards__label">{summary.label}</p>
          <p className="product-summary-cards__total">{summary.total} ks</p>
          <div className="product-summary-cards__breakdown">
            <span className="product-summary-cards__method product-summary-cards__method--delivery">
              Dovoz: {summary.delivery}
            </span>
            <span className="product-summary-cards__method product-summary-cards__method--pickup">
              Odber: {summary.pickup}
            </span>
            <span className="product-summary-cards__method product-summary-cards__method--dine-in">
              Prevádzka: {summary.dineIn}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
