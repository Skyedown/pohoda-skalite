import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/Toast/Toast';
import type { Pizza } from '../../types';
import './DrinksSection.less';

const drinks: Pizza[] = [
  { 
    id: 'drink-1', 
    name: 'Coca Cola', 
    description: 'Osviežujúci nápoj 330ml',
    price: 1.75, 
    image: '/images/pizza.png',
    ingredients: [],
    type: 'burger'
  },
  { 
    id: 'drink-2', 
    name: 'Fanta', 
    description: 'Pomarančový nápoj 330ml',
    price: 1.75, 
    image: '/images/pizza.png',
    ingredients: [],
    type: 'burger'
  },
  { 
    id: 'drink-3', 
    name: 'Natura neperlivá', 
    description: 'Minerálka 500ml',
    price: 1.50, 
    image: '/images/pizza.png',
    ingredients: [],
    type: 'burger'
  },
  { 
    id: 'drink-4', 
    name: 'Rajec neperlivá', 
    description: 'Minerálka 500ml',
    price: 1.50, 
    image: '/images/pizza.png',
    ingredients: [],
    type: 'burger'
  },
  { 
    id: 'snack-1', 
    name: 'Tyčinky Dru', 
    description: 'Slané tyčinky 220g',
    price: 2.25, 
    image: '/images/pizza.png',
    ingredients: [],
    type: 'burger'
  },
  { 
    id: 'drink-5', 
    name: 'Sprite', 
    description: 'Citrónový nápoj 330ml',
    price: 1.75, 
    image: '/images/pizza.png',
    ingredients: [],
    type: 'burger'
  },
  { 
    id: 'drink-6', 
    name: 'Kofola', 
    description: 'Tradičný nápoj 330ml',
    price: 1.50, 
    image: '/images/pizza.png',
    ingredients: [],
    type: 'burger'
  },
  { 
    id: 'drink-7', 
    name: 'Tonic', 
    description: 'Tonic water 250ml',
    price: 1.50, 
    image: '/images/pizza.png',
    ingredients: [],
    type: 'burger'
  },
];

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
            {drinks.map((item) => (
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
