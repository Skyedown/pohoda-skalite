import React, { useState, useEffect } from 'react';
import Toast from '../../components/Toast/Toast';
import ProductModal from '../../components/ProductModal/ProductModal';
import CartIcon from '../../components/CartIcon/CartIcon';
import type { Product, Extra, AdminSettings } from '../../types';
import { burgers } from '../../data/burgers';
import { getAdminSettings } from '../../utils/adminSettings';
import './BurgerSection.less';

const burgerExtras: Extra[] = [
  // Special extras
  {
    id: 'extra-patty',
    name: 'Extra mäso',
    price: 4.5,
  },
  { id: 'extra-cheddar', name: 'Extra cheddar', price: 1.2 },
  { id: 'grilovan-encian', name: 'Grilovaný encián', price: 3.5 },
  // Meat-based extras - 1.5 EUR
  { id: 'slanina', name: 'Slanina', price: 1.5 },
  // Non-meat extras - 0.80 EUR
  { id: 'salat', name: 'Šalát', price: 0.8 },
  { id: 'paradajka', name: 'Paradajka', price: 0.8 },
  { id: 'karamelizona-cibuľka', name: 'Karamelizovaná cibuľka', price: 0.8 },
  { id: 'kysla-uhorka', name: 'Kyslá uhorka', price: 0.8 },
  { id: 'sampiony', name: 'Šampiňóny', price: 0.8 },
  { id: 'cibuľka', name: 'Cibuľka', price: 0.8 },
  { id: 'jalapeno', name: 'Jallapeño', price: 0.8 },
  { id: 'baby-spenat', name: 'Baby špenát', price: 0.8 },
  { id: 'volske-oko', name: 'Volské oko', price: 0.8 },
];

const BurgerSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    mode: 'off',
    waitTimeMinutes: 60,
    customNote:
      'Z dôvodu nepriaznivého počasia je donáška možná len k hlavnej ceste',
    disabledProductTypes: [],
  });

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getAdminSettings();
      setAdminSettings(settings);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent<AdminSettings>) => {
      setAdminSettings(event.detail);
    };

    window.addEventListener(
      'adminSettingsChanged',
      handleSettingsChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        'adminSettingsChanged',
        handleSettingsChange as EventListener,
      );
    };
  }, []);

  const getBadgeLabel = (badge: string) => {
    const labels: Record<string, string> = {
      classic: 'NAŠA VOĽBA',
      premium: 'NAŠA VOĽBA',
      special: 'BESTSELLER',
    };
    return labels[badge] || '';
  };

  const handleOpenModal = (item: Product) => {
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
      <section id="burger-menu" className="burger-section">
        <div className="container">
          <h2 className="burger-section__title">Burgre</h2>

          <div className="burger-section__grid">
            {burgers.map((item) => (
              <div
                key={item.id}
                className={`burger-card ${(adminSettings.disabledProductTypes || []).includes('burger') ? 'burger-card--disabled' : ''}`}
                onClick={() => handleOpenModal(item)}
              >
                {item.badge && (
                  <span
                    className={`burger-card__badge burger-card__badge--${item.badge}`}
                  >
                    {getBadgeLabel(item.badge)}
                  </span>
                )}
                <div className="burger-card__image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3 className="burger-card__name">
                  {item.name}
                  {item.spicy && (
                    <img
                      src="/icons/chilli.svg"
                      alt="Spicy"
                      className="burger-card__spicy-icon"
                    />
                  )}
                </h3>
                <p className="burger-card__description">
                  {item.ingredients?.join(', ')}
                </p>
                {(item.weight || item.allergens) && (
                  <p className="burger-card__weight">
                    {item.weight}
                    {item.allergens && item.allergens.length > 0 && (
                      <span className="burger-card__allergens">
                        {' '}
                        (Alergény: {item.allergens.join(', ')})
                      </span>
                    )}
                  </p>
                )}
                <div className="burger-card__footer">
                  <div className="burger-card__price">
                    {item.price.toFixed(2)}€
                  </div>
                  <button
                    className={`burger-card__button ${(adminSettings.disabledProductTypes || []).includes('burger') ? 'burger-card__button--disabled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(item);
                    }}
                  >
                    <CartIcon />
                    {(adminSettings.disabledProductTypes || []).includes(
                      'burger',
                    )
                      ? 'NEDOSTUPNÉ'
                      : 'PRIDAŤ'}
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
        isDisabled={
          selectedItem
            ? (adminSettings.disabledProductTypes || []).includes('burger')
            : false
        }
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
