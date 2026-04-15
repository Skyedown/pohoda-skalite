import React from 'react';
import type { Product } from '../../../../types';
import CartIcon from '../../../shared/CartIcon/CartIcon';
import { getBadgeLabel } from '../../productSection.helpers';
import './PrilohyCard.less';

interface PrilohyCardProps {
  item: Product;
  isDisabled: boolean;
  onClick: (item: Product) => void;
}

export const PrilohyCard: React.FC<PrilohyCardProps> = ({
  item,
  isDisabled,
  onClick,
}) => (
  <div
    className={`prilohy-card ${isDisabled ? 'prilohy-card--disabled' : ''}`}
    onClick={() => onClick(item)}
  >
    {item.badge && (
      <span
        className={`prilohy-card__badge prilohy-card__badge--${item.badge}`}
      >
        {getBadgeLabel(item.badge)}
      </span>
    )}
    <div className="prilohy-card__image">
      <img src={item.image} alt={item.name} />
    </div>
    <h3 className="prilohy-card__name">
      {item.name}
      {item.spicy && (
        <img
          src="/icons/chilli.svg"
          alt="Spicy"
          className="prilohy-card__spicy-icon"
        />
      )}
    </h3>
    <p className="prilohy-card__description">{item.ingredients?.join(', ')}</p>
    {(item.weight || item.allergens) && (
      <p className="prilohy-card__weight">
        {item.weight}
        {item.allergens && item.allergens.length > 0 && (
          <span className="prilohy-card__allergens">
            {' '}
            (Alergény: {item.allergens.join(', ')})
          </span>
        )}
      </p>
    )}
    <div className="prilohy-card__footer">
      <div className="prilohy-card__price">{item.price.toFixed(2)}€</div>
      <button
        className={`prilohy-card__button ${isDisabled ? 'prilohy-card__button--disabled' : ''}`}
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
