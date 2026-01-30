import React, { useState } from 'react';
import Toast from '../../components/Toast/Toast';
import ProductModal from '../../components/ProductModal/ProductModal';
import CartIcon from '../../components/CartIcon/CartIcon';
import type { Pizza } from '../../types';
import { prilohy } from '../../data/prilohy';
import './PrilohySection.less';

const PrilohySection: React.FC = () => {
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
      <section id="prilohy-menu" className="prilohy-section">
        <div className="container">
          <h2 className="prilohy-section__title">Prílohy</h2>

          <div className="prilohy-section__grid">
            {prilohy.map((item) => (
              <div key={item.id} className="prilohy-card" onClick={() => handleOpenModal(item)}>
                {item.badge && (
                  <span className={`prilohy-card__badge prilohy-card__badge--${item.badge}`}>
                    {getBadgeLabel(item.badge)}
                  </span>
                )}
                <div className="prilohy-card__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3 className="prilohy-card__name">
                  {item.name}
                  {item.spicy && (
                    <img
                      src="/icons/chilli.svg"
                      alt="Spicy"
                      className="prilohy-card__spicy-icon"
                    />
                  )}
                </h3>
                <p className="prilohy-card__description">{item.ingredients?.join(', ')}</p>
                {(item.weight || item.allergens) && (
                  <p className="prilohy-card__weight">
                    {item.weight}
                    {item.allergens && item.allergens.length > 0 && (
                      <span className="prilohy-card__allergens"> (Alergény: {item.allergens.join(', ')})</span>
                    )}
                  </p>
                )}
                <div className="prilohy-card__footer">
                  <div className="prilohy-card__price">{item.price.toFixed(2)}€</div>
                  <button
                    className="prilohy-card__button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(item);
                    }}
                  >
                    <CartIcon />
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
        extras={[]}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default PrilohySection;
