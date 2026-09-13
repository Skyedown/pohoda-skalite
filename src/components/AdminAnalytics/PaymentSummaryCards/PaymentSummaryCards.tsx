import React from 'react';
import type { Currency } from '../../../i18n/types';
import type { PaymentSplit } from '../OrderStats.helpers';
import { formatMoney } from '../OrderStats.helpers';
import './PaymentSummaryCards.less';

interface PaymentSummaryCardsProps {
  split: PaymentSplit;
  currency: Currency;
}

function share(part: number, total: number): string {
  if (total === 0) return '0 %';
  return `${Math.round((part / total) * 100)} %`;
}

export const PaymentSummaryCards: React.FC<PaymentSummaryCardsProps> = ({
  split,
  currency,
}) => {
  const totalOrders = split.cashOrders + split.cardOrders;
  const totalValue = split.cashValue + split.cardValue;

  const cards = [
    {
      key: 'cash',
      label: 'Hotovosť',
      orders: split.cashOrders,
      value: split.cashValue,
    },
    {
      key: 'card',
      label: 'Karta',
      orders: split.cardOrders,
      value: split.cardValue,
    },
  ];

  return (
    <div className="payment-summary-cards">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`payment-summary-cards__card payment-summary-cards__card--${card.key}`}
        >
          <p className="payment-summary-cards__label">{card.label}</p>
          <p className="payment-summary-cards__value">
            {formatMoney(card.value, currency)}
          </p>
          <p className="payment-summary-cards__meta">
            {card.orders} objednávok · {share(card.orders, totalOrders)} z počtu
            · {share(card.value, totalValue)} z tržieb
          </p>
        </div>
      ))}
    </div>
  );
};
