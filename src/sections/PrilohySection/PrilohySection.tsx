import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/Toast/Toast';
import type { Pizza } from '../../types';
import { prilohy } from '../../data/prilohy';
import './PrilohySection.less';

const PrilohySection: React.FC = () => {
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
      <section className="prilohy-section">
        <div className="container">
          <h2 className="prilohy-section__title">Prílohy</h2>

          <div className="prilohy-section__grid">
            {prilohy.map((item) => (
              <div key={item.id} className="prilohy-card">
                {item.badge && (
                  <span className={`prilohy-card__badge prilohy-card__badge--${item.badge}`}>
                    {getBadgeLabel(item.badge)}
                  </span>
                )}
                <div className="prilohy-card__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3 className="prilohy-card__name">{item.name}</h3>
                <p className="prilohy-card__description">
                  {item.description}
                  {item.allergens && item.allergens.length > 0 && (
                    <span className="prilohy-card__allergens"> (Alergény: {item.allergens.join(', ')})</span>
                  )}
                </p>
                <div className="prilohy-card__footer">
                  <div className="prilohy-card__price">{item.price.toFixed(2)}€</div>
                  <button
                    className="prilohy-card__button"
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

export default PrilohySection;
