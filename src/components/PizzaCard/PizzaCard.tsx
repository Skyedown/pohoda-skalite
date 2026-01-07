import React from 'react';
import type { Pizza } from '../../types';
import './PizzaCard.less';

interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart: (pizza: Pizza) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAddToCart }) => {
  const getBadgeLabel = (badge: string) => {
    const labels: Record<string, string> = {
      classic: 'NAŠA VOĽBA',
      premium: 'NAŠA VOĽBA',
      special: 'BESTSELLER',
    };
    return labels[badge] || '';
  };

  // Show badge for certain pizzas
  const showBadge =
    pizza.badge === 'classic' || pizza.badge === 'special';

  return (
    <article onClick={() => onAddToCart(pizza)} className="pizza-card">
      {showBadge && pizza.badge && (
        <span
          className={`pizza-card__badge pizza-card__badge--${pizza.badge}`}
        >
          {getBadgeLabel(pizza.badge)}
        </span>
      )}

      <div className="pizza-card__image">
        <img src={pizza.image} alt={pizza.name} loading="lazy" />
      </div>

      <div className="pizza-card__content">
        <h3 className="pizza-card__name">{pizza.name}</h3>
        <p className="pizza-card__description">{pizza.ingredients?.join(', ')}</p>
        <p className="pizza-card__weight">
          {pizza.weight}
          {pizza.allergens && pizza.allergens.length > 0 && (
            <span className="pizza-card__allergens"> (Alergény: {pizza.allergens.join(', ')})</span>
          )}
        </p>

        <div className="pizza-card__footer">
          <div className="pizza-card__price">{pizza.price.toFixed(2)} €</div>
          <button
            className="pizza-card__button"
            aria-label={`Pridať ${pizza.name} do košíka`}
          >
            Objednať
          </button>
        </div>
      </div>
    </article>
  );
};

export default PizzaCard;
