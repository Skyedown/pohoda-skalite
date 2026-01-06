import React, { useState } from 'react';
import Toast from '../../components/Toast/Toast';
import ProductModal from '../../components/ProductModal/ProductModal';
import type { Pizza, Extra } from '../../types';
import { burgers } from '../../data/burgers';
import './BurgerSection.less';

const burgerExtras: Extra[] = [
  { id: 'extra-patty', name: 'Extra hovädzie patty', price: 2.5 },
  { id: 'extra-cheese', name: 'Extra syr', price: 1.0 },
  { id: 'bacon', name: 'Slanina', price: 1.5 },
  { id: 'egg', name: 'Vajce', price: 0.8 },
  { id: 'jalapeno', name: 'Jalapeño', price: 0.6 },
  { id: 'pickles', name: 'Extra pickles', price: 0.5 },
  { id: 'onion-rings', name: 'Cibuľové krúžky', price: 1.2 },
  { id: 'avocado', name: 'Avokádo', price: 1.5 },
];

const BurgerSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleOpenModal = (item: Pizza) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleItemAddedToCart = (itemName: string) => {
    setToastMessage(`${itemName} pridaný do košíka!`);
    setShowToast(true);
  };

  return (
    <>
      <section className="burger-section">
        <div className="container">
          <h2 className="burger-section__title">Burgre</h2>

          <div className="burger-section__grid">
            {burgers.map((item) => (
              <div key={item.id} className="burger-card" onClick={() => handleOpenModal(item)}>
                {item.badge && (
                  <span className={`burger-card__badge burger-card__badge--${item.badge}`}>
                    {getBadgeLabel(item.badge)}
                  </span>
                )}
                <div className="burger-card__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3 className="burger-card__name">{item.name}</h3>
                <p className="burger-card__description">{item.ingredients.join(', ')}</p>
                <p className="burger-card__weight">
                  200g
                  {item.allergens && item.allergens.length > 0 && (
                    <span className="burger-card__allergens"> (Alergény: {item.allergens.join(', ')})</span>
                  )}
                </p>
                <div className="burger-card__footer">
                  <div className="burger-card__price">{item.price.toFixed(2)}€</div>
                  <button
                    className="burger-card__button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(item);
                    }}
                  >
                    PRIDAŤ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleItemAddedToCart}
        extras={burgerExtras}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default BurgerSection;
