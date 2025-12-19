import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/Toast/Toast';
import type { Pizza } from '../../types';
import { langos } from '../../data/langos';
import './LangosSection.less';

const LangosSection: React.FC = () => {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const getBadgeLabel = (badge: string) => {
    const labels: Record<string, string> = {
      classic: 'NAŠA VOĽBA',
      premium: 'NAŠA VOĽBA',
      special: 'BESTSELLER',
    };
    return labels[badge] || '';
  };

  const handleAddToCart = (item: Pizza) => {
    addToCart(item, 'medium', 1);
    setToastMessage(`${item.name} pridaný do košíka!`);
    setShowToast(true);
  };

  return (
    <>
      <section className="langos-section">
        <div className="container">
          <p className="langos-section__subtitle">Chrumkavé a chutné</p>
          <h2 className="langos-section__title">Langoše</h2>

          <div className="langos-section__grid">
            {langos.map((item) => (
              <div key={item.id} className="langos-card">
                {item.badge && (
                  <span className={`langos-card__badge langos-card__badge--${item.badge}`}>
                    {getBadgeLabel(item.badge)}
                  </span>
                )}
                <div className="langos-card__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3 className="langos-card__name">{item.name}</h3>
                <p className="langos-card__size">
                  {item.description}
                  {item.allergens && item.allergens.length > 0 && (
                    <span className="langos-card__allergens"> (Alergény: {item.allergens.join(', ')})</span>
                  )}
                </p>
                <div className="langos-card__footer">
                  <div className="langos-card__price">{item.price.toFixed(2)} €</div>
                  <button
                    className="langos-card__button"
                    onClick={() => handleAddToCart(item)}
                  >
                    PRIDAŤ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default LangosSection;
