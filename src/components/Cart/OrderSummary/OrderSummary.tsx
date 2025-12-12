import React from 'react';
import './OrderSummary.less';

interface OrderSummaryProps {
  subtotal: number;
  delivery: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, delivery, total }) => {
  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Súhrn objednávky</h3>

      <div className="order-summary__row">
        <span>Medzisúčet</span>
        <span>{subtotal.toFixed(2)} €</span>
      </div>

      <div className="order-summary__row">
        <span>Doprava</span>
        <span>{delivery.toFixed(2)} €</span>
      </div>

      <div className="order-summary__row order-summary__row--total">
        <span>Celkom</span>
        <span className="order-summary__total-price">{total.toFixed(2)} €</span>
      </div>
    </div>
  );
};

export default OrderSummary;
