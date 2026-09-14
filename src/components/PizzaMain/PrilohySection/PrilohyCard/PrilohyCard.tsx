import React from 'react';
import type { LocalizedProduct } from '../../../../types';
import CartIcon from '../../../shared/CartIcon/CartIcon';
import { useLocale } from '../../../../i18n/LocaleContext';
import { getBadgeLabel } from '../../productSection.helpers';
import './PrilohyCard.less';

interface PrilohyCardProps {
  item: LocalizedProduct;
  isDisabled: boolean;
  onClick: (item: LocalizedProduct) => void;
}

export const PrilohyCard: React.FC<PrilohyCardProps> = ({
  item,
  isDisabled,
  onClick,
}) => {
  const { t, price } = useLocale();

  return (
    <div
      className={`prilohy-card ${isDisabled ? 'prilohy-card--disabled' : ''}`}
      onClick={() => onClick(item)}
    >
      {item.badge && (
        <span
          className={`prilohy-card__badge prilohy-card__badge--${item.badge}`}
        >
          {getBadgeLabel(item.badge, t)}
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
      <p className="prilohy-card__description">
        {item.ingredients?.join(', ')}
      </p>
      {(item.weight || item.allergens) && (
        <p className="prilohy-card__weight">
          {item.weight}
          {item.allergens && item.allergens.length > 0 && (
            <span className="prilohy-card__allergens">
              {' '}
              ({t('common_allergens')}: {item.allergens.join(', ')})
            </span>
          )}
        </p>
      )}
      <div className="prilohy-card__footer">
        <div className="prilohy-card__price">{price(item.price)}</div>
        <button
          className={`prilohy-card__button ${isDisabled ? 'prilohy-card__button--disabled' : ''}`}
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
