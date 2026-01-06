import React, { useState } from 'react';
import Toast from '../../components/Toast/Toast';
import ProductModal from '../../components/ProductModal/ProductModal';
import type { Pizza, Extra, RequiredOption } from '../../types';
import { langos } from '../../data/langos';
import './LangosSection.less';

const langosExtras: Extra[] = [
  { id: 'extra-cheese', name: 'Extra syr', price: 1.0 },
  { id: 'sour-cream', name: 'Kyslá smotana', price: 0.5 },
  { id: 'garlic', name: 'Cesnak', price: 0.3 },
  { id: 'ketchup', name: 'Kečup', price: 0.3 },
  { id: 'ham', name: 'Šunka', price: 1.5 },
  { id: 'salami', name: 'Saláma', price: 1.5 },
  { id: 'vegetables', name: 'Zelenina mix', price: 1.0 },
  { id: 'nutella', name: 'Nutella', price: 1.5 },
];

const langosKlasikRequiredOption: RequiredOption = {
  id: 'sauce-choice',
  name: 'Výber omáčky',
  label: 'Vyberte omáčku',
  options: [
    { id: 'ketchup', label: 'Kečup' },
    { id: 'tartarska', label: 'Tatarská' },
  ],
};

const LangosSection: React.FC = () => {
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
      <section className="langos-section">
        <div className="container">
          <p className="langos-section__subtitle">Chrumkavé a chutné</p>
          <h2 className="langos-section__title">Langoše</h2>

          <div className="langos-section__grid">
            {langos.map((item) => (
              <div key={item.id} className="langos-card" onClick={() => handleOpenModal(item)}>
                {item.badge && (
                  <span className={`langos-card__badge langos-card__badge--${item.badge}`}>
                    {getBadgeLabel(item.badge)}
                  </span>
                )}
                <div className="langos-card__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3 className="langos-card__name">{item.name}</h3>
                <p className="langos-card__description">
                  {item.ingredients.join(', ')}
                  {item.allergens && item.allergens.length > 0 && (
                    <span className="langos-card__allergens"> (Alergény: {item.allergens.join(', ')})</span>
                  )}
                </p>
                <div className="langos-card__footer">
                  <div className="langos-card__price">{item.price.toFixed(2)} €</div>
                  <button
                    className="langos-card__button"
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
        extras={langosExtras}
        requiredOption={selectedItem?.id === 'langos-3' ? langosKlasikRequiredOption : undefined}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default LangosSection;
