import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/Toast/Toast';
import type { Pizza } from '../../types';
import { menuItems } from '../../data/menu';
import './BurgerSection.less';

// Filter burgers and langos from menu
const burgers = menuItems.filter(item => item.type === 'burger' || item.type === 'langos');

const BurgerSection: React.FC = () => {
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
      <section className="burger-section">
        <div className="container">
          <h2 className="burger-section__title">Burgre a langoše</h2>
          
          <div className="burger-section__grid">
            {burgers.map((item) => (
              <div key={item.id} className="burger-card">
                <div className="burger-card__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3 className="burger-card__name">{item.name}</h3>
                <p className="burger-card__weight">200g</p>
                <div className="burger-card__footer">
                  <div className="burger-card__price">{item.price.toFixed(2)}€</div>
                  <button
                    className="burger-card__button"
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

export default BurgerSection;
