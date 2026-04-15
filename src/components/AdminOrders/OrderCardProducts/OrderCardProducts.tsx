import React from 'react';
import type { OrderItem } from '../types';
import './OrderCardProducts.less';

interface OrderCardProductsProps {
  items: OrderItem[];
}

export const OrderCardProducts: React.FC<OrderCardProductsProps> = ({
  items,
}) => {
  return (
    <div className="admin-orders__item-products">
      {items.map((item, index) => (
        <div key={index} className="admin-orders__item-product">
          <span className="admin-orders__item-product-qty">
            {item.quantity}×
          </span>
          <span className="admin-orders__item-product-name">
            {item.product.name}
            {item.extras.length > 0 && (
              <span className="admin-orders__item-product-extras">
                {' '}
                + {item.extras.map((e) => e.name).join(', ')}
              </span>
            )}
            {item.removedIngredients && item.removedIngredients.length > 0 && (
              <span className="admin-orders__item-product-removed">
                {' '}
                Bez: {item.removedIngredients.join(', ')}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};
