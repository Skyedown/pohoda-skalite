import React from 'react';
import type { SummaryStats } from '../OrderStats.helpers';

interface OrderSummaryCardsProps {
  stats: SummaryStats;
}

export const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({
  stats,
}) => {
  const { totalRevenue, totalOrders, avgOrderValue } = stats;

  return (
    <div className="order-stats__summary">
      <div className="order-stats__summary-card order-stats__summary-card--revenue">
        <p className="order-stats__summary-label">Celkové tržby</p>
        <p className="order-stats__summary-value">{totalRevenue.toFixed(2)} €</p>
      </div>
      <div className="order-stats__summary-card order-stats__summary-card--orders">
        <p className="order-stats__summary-label">Celkom objednávok</p>
        <p className="order-stats__summary-value">{totalOrders}</p>
      </div>
      <div className="order-stats__summary-card order-stats__summary-card--avg">
        <p className="order-stats__summary-label">Priemerná objednávka</p>
        <p className="order-stats__summary-value">
          {avgOrderValue.toFixed(2)} €
        </p>
      </div>
    </div>
  );
};
