import React from 'react';
import type { OrderDelivery } from '../types';
import type { Currency } from '../../../i18n/types';
import { formatWithEur } from '../../../i18n/format';
import './OrderCardInfo.less';
import { getDeliveryMethodLabel, formatAddress } from '../adminOrdersHelpers';

interface OrderCardInfoProps {
  delivery: OrderDelivery;
  payment: { method: 'cash' | 'card' };
  total: number;
  totalEur: number;
  currency: Currency;
}

export const OrderCardInfo: React.FC<OrderCardInfoProps> = ({
  delivery,
  payment,
  total,
  totalEur,
  currency,
}) => {
  const hasAddress = (delivery.street || delivery.houseNumber) && delivery.city;

  return (
    <div className="admin-orders__item-info">
      <div className="admin-orders__item-row">
        <span className="admin-orders__item-label">Suma:</span>
        <span className="admin-orders__item-value">
          {formatWithEur(total, totalEur, currency)}
        </span>
      </div>
      <div className="admin-orders__item-row">
        <span className="admin-orders__item-label">Typ:</span>
        <span className="admin-orders__item-value">
          {getDeliveryMethodLabel(delivery.method)}
        </span>
      </div>
      <div className="admin-orders__item-row">
        <span className="admin-orders__item-label">Platba:</span>
        <span className="admin-orders__item-value">
          {payment.method === 'cash' ? 'Hotovosť' : 'Karta'}
        </span>
      </div>
      {delivery.fullName && (
        <div className="admin-orders__item-row">
          <span className="admin-orders__item-label">Meno:</span>
          <span className="admin-orders__item-value">{delivery.fullName}</span>
        </div>
      )}
      {delivery.phone && (
        <div className="admin-orders__item-row">
          <span className="admin-orders__item-label">Telefón:</span>
          <span className="admin-orders__item-value">{delivery.phone}</span>
        </div>
      )}
      {hasAddress && (
        <div className="admin-orders__item-row">
          <span className="admin-orders__item-label">Adresa:</span>
          <span className="admin-orders__item-value">
            {formatAddress(
              delivery.street,
              delivery.houseNumber,
              delivery.city!,
            )}
          </span>
        </div>
      )}
    </div>
  );
};
