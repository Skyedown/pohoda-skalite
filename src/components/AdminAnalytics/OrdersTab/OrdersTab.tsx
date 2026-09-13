import React, { useCallback } from 'react';
import type { Currency } from '../../../i18n/types';
import type {
  DayStat,
  DeliveryMethodFilter,
  PaymentMethodFilter,
} from '../OrderStats.helpers';
import {
  computeCategories,
  computePaymentSplit,
  computeSummaryStats,
} from '../OrderStats.helpers';
import { OrderSummaryCards } from '../OrderSummaryCards/OrderSummaryCards';
import { PaymentSummaryCards } from '../PaymentSummaryCards/PaymentSummaryCards';
import { OrderCharts } from '../OrderCharts/OrderCharts';
import './OrdersTab.less';

const DELIVERY_OPTIONS: { value: DeliveryMethodFilter; label: string }[] = [
  { value: 'all', label: 'Všetky' },
  { value: 'pickup', label: 'Osobný odber' },
  { value: 'dine-in', label: 'Prevádzka' },
  { value: 'delivery', label: 'Dovoz' },
  { value: 'pickup,delivery', label: 'Odber + Dovoz' },
];

const PAYMENT_OPTIONS: { value: PaymentMethodFilter; label: string }[] = [
  { value: 'all', label: 'Všetky' },
  { value: 'cash', label: 'Hotovosť' },
  { value: 'card', label: 'Karta' },
];

interface OrdersTabProps {
  stats: DayStat[];
  currency: Currency;
  deliveryMethod: DeliveryMethodFilter;
  paymentMethod: PaymentMethodFilter;
  onDeliveryMethodChange: (method: DeliveryMethodFilter) => void;
  onPaymentMethodChange: (method: PaymentMethodFilter) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  stats,
  currency,
  deliveryMethod,
  paymentMethod,
  onDeliveryMethodChange,
  onPaymentMethodChange,
}) => {
  const categories = computeCategories(stats);
  const summaryStats = computeSummaryStats(stats);
  const paymentSplit = computePaymentSplit(stats);

  const handleMethodChange = useCallback(
    (method: DeliveryMethodFilter) => onDeliveryMethodChange(method),
    [onDeliveryMethodChange],
  );

  const handlePaymentChange = useCallback(
    (method: PaymentMethodFilter) => onPaymentMethodChange(method),
    [onPaymentMethodChange],
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

      <div className="orders-tab__filter-group">
        <span className="orders-tab__filter-label">Spôsob platby</span>
        <div className="orders-tab__filter-tiles">
          {PAYMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={paymentMethod === opt.value ? 'active' : ''}
              onClick={() => handlePaymentChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <OrderSummaryCards stats={summaryStats} currency={currency} />
      <PaymentSummaryCards split={paymentSplit} currency={currency} />
      <OrderCharts stats={stats} categories={categories} currency={currency} />
    </div>
  );
};
