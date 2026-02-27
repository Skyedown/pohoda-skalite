import React from 'react';
import type { Product } from '../../types';
import CartIcon from '../CartIcon/CartIcon';
import './ProductCard.less';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  showBadge?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showBadge = true,
}) => {
  const getBadgeLabel = (badge: string) => {
    const labels: Record<string, string> = {
      classic: 'NAŠA VOĽBA',
      premium: 'NAŠA VOĽBA',
      special: 'BESTSELLER',
    };
    return labels[badge] || '';
  };

  return (
    <article onClick={() => onAddToCart(product)} className="product-card">
      {showBadge && product.badge && (
        <span
          className={`product-card__badge product-card__badge--${product.badge}`}
        >
          {getBadgeLabel(product.badge)}
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
              (Alergény: {product.allergens.join(', ')})
            </span>
          )}
        </p>

        <div className="product-card__footer">
          <div className="product-card__price">
            {product.price.toFixed(2)} €
          </div>
          <button
            className="product-card__button"
            aria-label={`Pridať ${product.name} do košíka`}
          >
            <CartIcon />
            Pridať
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
