import React from 'react';
import type { Pizza } from '../../types';
import './PizzaCard.less';

interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart: (pizza: Pizza) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAddToCart }) => {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      classic: 'NAŠA VOĽBA',
      premium: 'NAŠA VOĽBA',
      special: 'BESTSELLER',
    };
    return labels[category] || '';
  };

  // Show badge for certain pizzas
  const showBadge =
    pizza.category === 'classic' || pizza.category === 'special';

  return (
    <article onClick={() => onAddToCart(pizza)} className="pizza-card">
      {showBadge && pizza.category && (
        <span
          className={`pizza-card__badge pizza-card__badge--${pizza.category}`}
        >
          {getCategoryLabel(pizza.category)}
        </span>
      )}

      <div className="pizza-card__image">
        <img src={pizza.image} alt={pizza.name} loading="lazy" />
      </div>

      <div className="pizza-card__content">
        <h3 className="pizza-card__name">{pizza.name}</h3>
        <p className="pizza-card__description">{pizza.description}</p>
        <p className="pizza-card__weight">850g</p>

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
