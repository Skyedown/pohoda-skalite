import React from 'react';
import type { CartItem as CartItemType } from '../../../types';
import './CartItem.less';

interface CartItemProps {
  item: CartItemType;
  index: number;
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, index, onRemove, onUpdateQuantity }) => {
  return (
    <div className="cart-item">
      <div className="cart-item__header">
        <h3 className="cart-item__name">{item.pizza.name}</h3>
        <button
          className="cart-item__remove"
          onClick={() => onRemove(index)}
          aria-label="Odstrániť"
        >
          ×
        </button>
      </div>

      <p className="cart-item__description">{item.pizza.description}</p>

      {item.requiredOption && (
        <p className="cart-item__required">
          {item.requiredOption.name}: <strong>{item.requiredOption.selectedValue}</strong>
        </p>
      )}

      {item.extras && item.extras.length > 0 && (
        <p className="cart-item__extras">+ {item.extras.map(e => e.name).join(', ')}</p>
      )}

      {item.pizza.type === 'pizza' && (
        <p className="cart-item__weight">850g</p>
      )}

      <div className="cart-item__footer">
        <div className="cart-item__quantity">
          <button
            className="cart-item__qty-btn"
            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            −
          </button>
          <span className="cart-item__qty-value">{item.quantity}</span>
          <button
            className="cart-item__qty-btn"
            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
          >
            +
          </button>
        </div>

        <div className="cart-item__price">
          {item.totalPrice.toFixed(2)} €
        </div>
      </div>
    </div>
  );
};

export default CartItem;
