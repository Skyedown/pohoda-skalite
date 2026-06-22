import React from 'react';
import type { Product } from '../../../../types';
import CartIcon from '../../../shared/CartIcon/CartIcon';
import './SimpleProductCard.less';

interface SimpleProductCardProps {
  item: Product;
  isDisabled: boolean;
  quantity: number;
  onIncrement: (item: Product) => void;
  onDecrement: (item: Product) => void;
}

export const SimpleProductCard: React.FC<SimpleProductCardProps> = ({
  item,
  isDisabled,
  quantity,
  onIncrement,
  onDecrement,
}) => {
  const handleCardClick = () => {
    if (isDisabled || quantity > 0) return;
    onIncrement(item);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDisabled) return;
    onIncrement(item);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDecrement(item);
  };

  return (
    <div
      className={`simple-product-card ${isDisabled ? 'simple-product-card--disabled' : ''} ${quantity > 0 ? 'simple-product-card--in-cart' : ''}`}
      onClick={handleCardClick}
    >
      <div className="simple-product-card__image">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <h3 className="simple-product-card__name">{item.name}</h3>
      {item.description && (
        <p className="simple-product-card__description">{item.description}</p>
      )}
      {(item.weight || (item.allergens && item.allergens.length > 0)) && (
        <p className="simple-product-card__weight">
          {item.weight}
          {item.allergens && item.allergens.length > 0 && (
            <span className="simple-product-card__allergens">
              {' '}
              (Alergény: {item.allergens.join(', ')})
            </span>
          )}
        </p>
      )}
      <div className="simple-product-card__footer">
        <div className="simple-product-card__price">
          {item.price.toFixed(2)}€
        </div>
        {quantity > 0 ? (
          <div className="simple-product-card__counter">
            <button
              className="simple-product-card__counter-btn"
              onClick={handleDecrement}
              aria-label={`Odobrať ${item.name} z košíka`}
            >
              −
            </button>
            <span className="simple-product-card__counter-qty">{quantity}</span>
            <button
              className="simple-product-card__counter-btn simple-product-card__counter-btn--plus"
              onClick={handleIncrement}
              disabled={isDisabled}
              aria-label={`Pridať ďalší ${item.name}`}
            >
              +
            </button>
          </div>
        ) : (
          <button
            className={`simple-product-card__button ${isDisabled ? 'simple-product-card__button--disabled' : ''}`}
            onClick={handleIncrement}
            disabled={isDisabled}
            aria-label={`Pridať ${item.name} do košíka`}
          >
            <CartIcon />
            {isDisabled ? 'NEDOSTUPNÉ' : 'PRIDAŤ'}
          </button>
        )}
      </div>
    </div>
  );
};
