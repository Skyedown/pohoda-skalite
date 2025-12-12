import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/Toast/Toast';
import { drinksAndSnacks } from '../../data/menu';
import './DrinksSection.less';

const DrinksSection: React.FC = () => {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddToCart = (item: Pizza) => {
    addToCart(item, 'medium', 1);
    setToastMessage(`${item.name} pridaný do košíka!`);
    setShowToast(true);
  };

  return (
    <>
      <section className="drinks-section">
        <div className="container">
          <p className="drinks-section__subtitle">Niečo k pizze</p>
          <h2 className="drinks-section__title">Nápoje a pochutiny</h2>
          
          <div className="drinks-section__grid">
            {drinksAndSnacks.map((item) => (
              <div key={item.id} className="drink-card">
                <div className="drink-card__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3 className="drink-card__name">{item.name}</h3>
                <p className="drink-card__size">{item.description}</p>
                <div className="drink-card__footer">
                  <div className="drink-card__price">{item.price.toFixed(2)} €</div>
                  <button
                    className="drink-card__button"
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

export default DrinksSection;
