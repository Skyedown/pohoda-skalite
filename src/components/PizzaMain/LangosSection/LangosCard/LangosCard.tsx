import React from 'react';
import type { Product } from '../../../../types';
import CartIcon from '../../../shared/CartIcon/CartIcon';
import { getBadgeLabel } from '../../productSection.helpers';
import './LangosCard.less';

interface LangosCardProps {
  item: Product;
  isDisabled: boolean;
  onClick: (item: Product) => void;
}

export const LangosCard: React.FC<LangosCardProps> = ({
  item,
  isDisabled,
  onClick,
}) => (
  <div
    className={`langos-card ${isDisabled ? 'langos-card--disabled' : ''}`}
    onClick={() => onClick(item)}
  >
    {item.badge && (
      <span className={`langos-card__badge langos-card__badge--${item.badge}`}>
        {getBadgeLabel(item.badge)}
      </span>
    )}
    <div className="langos-card__image">
      <img src={item.image} alt={item.name} />
    </div>
    <h3 className="langos-card__name">
      {item.name}
      {item.spicy && (
        <img
          src="/icons/chilli.svg"
          alt="Spicy"
          className="langos-card__spicy-icon"
        />
      )}
    </h3>
    <p className="langos-card__description">{item.ingredients?.join(', ')}</p>
    {(item.weight || item.allergens) && (
      <p className="langos-card__weight">
        {item.weight}
        {item.allergens && item.allergens.length > 0 && (
          <span className="langos-card__allergens">
            {' '}
            (Alergény: {item.allergens.join(', ')})
          </span>
        )}
      </p>
    )}
    <div className="langos-card__footer">
      <div className="langos-card__price">{item.price.toFixed(2)} €</div>
      <button
        className={`langos-card__button ${isDisabled ? 'langos-card__button--disabled' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onClick(item);
        }}
      >
        <CartIcon />
        {isDisabled ? 'NEDOSTUPNÉ' : 'PRIDAŤ'}
      </button>
    </div>
  </div>
);
