import React from 'react';
import type { CartItem as CartItemType } from '../../../types';
import './CartItem.less';

interface CartItemProps {
  item: CartItemType;
  index: number;
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  index,
  onRemove,
  onUpdateQuantity,
}) => {
  // Defensive check for item and product
  if (!item || !item.product) {
    console.error('CartItem: Invalid item or missing product', item);
    return null;
  }

  return (
    <div className="cart-item">
      <div className="cart-item__header">
        <h3 className="cart-item__name">
          {item.product.name || 'Neznámy produkt'}
        </h3>
        <button
          className="cart-item__remove"
          onClick={() => onRemove(index)}
          aria-label="Odstrániť"
        >
          ×
        </button>
      </div>

      {item.product.ingredients && item.product.ingredients.length > 0 && (
        <p className="cart-item__ingredients">
          {item.product.ingredients.join(', ')}
        </p>
      )}

      {item.requiredOption && (
        <p className="cart-item__required">
          {item.requiredOption.name}:{' '}
          <strong>{item.requiredOption.selectedValue}</strong>
        </p>
      )}

      {item.extras && item.extras.length > 0 && (
        <p className="cart-item__extras">
          +{' '}
          {item.extras
            .map((e) => e.name)
            .join(', ')
            .toLocaleLowerCase()}
        </p>
      )}

      {item.product.weight && (
        <p className="cart-item__weight">{item.product.weight}</p>
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

        <div className="cart-item__price">{item.totalPrice.toFixed(2)} €</div>
      </div>
    </div>
  );
};

export default CartItem;
