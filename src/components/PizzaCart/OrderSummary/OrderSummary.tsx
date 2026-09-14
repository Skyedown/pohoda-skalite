import React from 'react';
import { useLocale } from '../../../i18n/LocaleContext';
import { formatWithEur } from '../../../i18n/format';
import './OrderSummary.less';

interface OrderSummaryProps {
  subtotal: number;
  delivery: number;
  total: number;
  totalEur: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  delivery,
  total,
  totalEur,
}) => {
  const { t, price, currency } = useLocale();

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">{t('summary_title')}</h3>

      <div className="order-summary__row">
        <span>{t('summary_subtotal')}</span>
        <span>{price(subtotal)}</span>
      </div>

      <div className="order-summary__row">
        <span>{t('summary_delivery')}</span>
        <span>{price(delivery)}</span>
      </div>

      <div className="order-summary__row order-summary__row--total">
        <span>{t('summary_total')}</span>
        <span className="order-summary__total-price">
          {formatWithEur(total, totalEur, currency)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
