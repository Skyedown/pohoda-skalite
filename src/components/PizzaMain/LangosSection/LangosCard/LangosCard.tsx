import React from 'react';
import type { LocalizedProduct } from '../../../../types';
import CartIcon from '../../../shared/CartIcon/CartIcon';
import { useLocale } from '../../../../i18n/LocaleContext';
import { getBadgeLabel } from '../../productSection.helpers';
import './LangosCard.less';

interface LangosCardProps {
  item: LocalizedProduct;
  isDisabled: boolean;
  onClick: (item: LocalizedProduct) => void;
}

export const LangosCard: React.FC<LangosCardProps> = ({
  item,
  isDisabled,
  onClick,
}) => {
  const { t, price } = useLocale();

  return (
    <div
      className={`langos-card ${isDisabled ? 'langos-card--disabled' : ''}`}
      onClick={() => onClick(item)}
    >
      {item.badge && (
        <span
          className={`langos-card__badge langos-card__badge--${item.badge}`}
        >
          {getBadgeLabel(item.badge, t)}
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
              ({t('common_allergens')}: {item.allergens.join(', ')})
            </span>
          )}
        </p>
      )}
      <div className="langos-card__footer">
        <div className="langos-card__price">{price(item.price)}</div>
        <button
          className={`langos-card__button ${isDisabled ? 'langos-card__button--disabled' : ''}`}
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
