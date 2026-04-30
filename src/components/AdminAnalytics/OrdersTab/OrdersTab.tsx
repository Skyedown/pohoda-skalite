import React, { useCallback } from 'react';
import type { DayStat, DeliveryMethodFilter } from '../OrderStats.helpers';
import { computeCategories, computeSummaryStats } from '../OrderStats.helpers';
import { OrderSummaryCards } from '../OrderSummaryCards/OrderSummaryCards';
import { OrderCharts } from '../OrderCharts/OrderCharts';
import './OrdersTab.less';

const DELIVERY_OPTIONS: { value: DeliveryMethodFilter; label: string }[] = [
  { value: 'all', label: 'Všetky' },
  { value: 'pickup', label: 'Osobný odber' },
  { value: 'dine-in', label: 'Prevádzka' },
  { value: 'delivery', label: 'Dovoz' },
  { value: 'pickup,delivery', label: 'Odber + Dovoz' },
];

interface OrdersTabProps {
  stats: DayStat[];
  deliveryMethod: DeliveryMethodFilter;
  onDeliveryMethodChange: (method: DeliveryMethodFilter) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  stats,
  deliveryMethod,
  onDeliveryMethodChange,
}) => {
  const categories = computeCategories(stats);
  const summaryStats = computeSummaryStats(stats);

  const handleMethodChange = useCallback(
    (method: DeliveryMethodFilter) => onDeliveryMethodChange(method),
    [onDeliveryMethodChange],
  );

  return (
    <div className="orders-tab">
      <div className="orders-tab__filter-group">
        <span className="orders-tab__filter-label">Spôsob doručenia</span>
        <div className="orders-tab__filter-tiles">
          {DELIVERY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={deliveryMethod === opt.value ? 'active' : ''}
              onClick={() => handleMethodChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <OrderSummaryCards stats={summaryStats} />
      <OrderCharts stats={stats} categories={categories} />
    </div>
  );
};
