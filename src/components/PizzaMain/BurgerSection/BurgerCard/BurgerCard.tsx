import React from 'react';
import type { LocalizedProduct } from '../../../../types';
import CartIcon from '../../../shared/CartIcon/CartIcon';
import { useLocale } from '../../../../i18n/LocaleContext';
import { getBadgeLabel } from '../../productSection.helpers';
import './BurgerCard.less';

interface BurgerCardProps {
  item: LocalizedProduct;
  isDisabled: boolean;
  onClick: (item: LocalizedProduct) => void;
}

export const BurgerCard: React.FC<BurgerCardProps> = ({
  item,
  isDisabled,
  onClick,
}) => {
  const { t, price } = useLocale();

  return (
    <div
      className={`burger-card ${isDisabled ? 'burger-card--disabled' : ''}`}
      onClick={() => onClick(item)}
    >
      {item.badge && (
        <span
          className={`burger-card__badge burger-card__badge--${item.badge}`}
        >
          {getBadgeLabel(item.badge, t)}
        </span>
      )}
      <div className="burger-card__image">
        <img src={item.image} alt={item.name} />
      </div>
      <h3 className="burger-card__name">
        {item.name}
        {item.spicy && (
          <img
            src="/icons/chilli.svg"
            alt="Spicy"
            className="burger-card__spicy-icon"
          />
        )}
      </h3>
      <p className="burger-card__description">{item.ingredients?.join(', ')}</p>
      {(item.weight || item.allergens) && (
        <p className="burger-card__weight">
          {item.weight}
          {item.allergens && item.allergens.length > 0 && (
            <span className="burger-card__allergens">
              {' '}
              ({t('common_allergens')}: {item.allergens.join(', ')})
            </span>
          )}
        </p>
      )}
      <div className="burger-card__footer">
        <div className="burger-card__price">{price(item.price)}</div>
        <button
          className={`burger-card__button ${isDisabled ? 'burger-card__button--disabled' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onClick(item);
          }}
        >
          <CartIcon />
          {isDisabled ? t('common_unavailable_upper') : t('common_add_upper')}
        </button>
      </div>
    </div>
  );
};
