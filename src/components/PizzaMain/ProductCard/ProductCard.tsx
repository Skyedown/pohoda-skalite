import React from 'react';
import type { LocalizedProduct } from '../../../types';
import CartIcon from '../../shared/CartIcon/CartIcon';
import { useLocale } from '../../../i18n/LocaleContext';
import { getBadgeLabel } from '../productSection.helpers';
import './ProductCard.less';

interface ProductCardProps {
  product: LocalizedProduct;
  onAddToCart: (product: LocalizedProduct) => void;
  showBadge?: boolean;
  isDisabled?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showBadge = true,
  isDisabled = false,
}) => {
  const { t, price } = useLocale();

  const handleClick = () => {
    onAddToCart(product);
  };

  return (
    <article
      onClick={handleClick}
      className={`product-card ${isDisabled ? 'product-card--disabled' : ''}`}
    >
      {showBadge && product.badge && (
        <span
          className={`product-card__badge product-card__badge--${product.badge}`}
        >
          {getBadgeLabel(product.badge, t)}
        </span>
      )}

      <div className="product-card__image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__name">
          {product.name}
          {product.spicy && (
            <img
              src="/icons/chilli.svg"
              alt="Spicy"
              className="product-card__spicy-icon"
            />
          )}
        </h3>
        <p className="product-card__description">
          {product.ingredients?.join(', ')}
        </p>
        <p className="product-card__weight">
          {product.weight}
          {product.allergens && product.allergens.length > 0 && (
            <span className="product-card__allergens">
              {' '}
              ({t('common_allergens')}: {product.allergens.join(', ')})
            </span>
          )}
        </p>

        <div className="product-card__footer">
          <div className="product-card__price">{price(product.price)}</div>
          <button
            className={`product-card__button ${isDisabled ? 'product-card__button--disabled' : ''}`}
            aria-label={t('product_add_aria', { name: product.name })}
          >
            <CartIcon />
            {isDisabled ? t('common_unavailable') : t('common_add')}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
