import React, { useState, useEffect } from 'react';
import Toast from '../../components/shared/Toast/Toast';
import ProductModal from '../../components/PizzaMain/ProductModal/ProductModal';
import CartIcon from '../../components/shared/CartIcon/CartIcon';
import type { Product, AdminSettings } from '../../types';
import { prilohy } from '../../data/prilohy';
import { getAdminSettings } from '../../utils/adminSettings';
import './PrilohySection.less';

const PrilohySection: React.FC = () => {
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
      <section id="prilohy-menu" className="prilohy-section">
        <div className="container">
          <h2 className="prilohy-section__title">Prílohy</h2>

          <div className="prilohy-section__grid">
            {prilohy.map((item) => (
              <div
                key={item.id}
                className={`prilohy-card ${(adminSettings.disabledProductTypes || []).includes('sides') ? 'prilohy-card--disabled' : ''}`}
                onClick={() => handleOpenModal(item)}
              >
                {item.badge && (
                  <span
                    className={`prilohy-card__badge prilohy-card__badge--${item.badge}`}
                  >
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
                <p className="prilohy-card__description">
                  {item.ingredients?.join(', ')}
                </p>
                {(item.weight || item.allergens) && (
                  <p className="prilohy-card__weight">
                    {item.weight}
                    {item.allergens && item.allergens.length > 0 && (
                      <span className="prilohy-card__allergens">
                        {' '}
                        (Alergény: {item.allergens.join(', ')})
                      </span>
                    )}
                  </p>
                )}
                <div className="prilohy-card__footer">
                  <div className="prilohy-card__price">
                    {item.price.toFixed(2)}€
                  </div>
                  <button
                    className={`prilohy-card__button ${(adminSettings.disabledProductTypes || []).includes('sides') ? 'prilohy-card__button--disabled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(item);
                    }}
                  >
                    <CartIcon />
                    {(adminSettings.disabledProductTypes || []).includes(
                      'sides',
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
        extras={[]}
        isDisabled={
          selectedItem
            ? (adminSettings.disabledProductTypes || []).includes('sides')
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

export default PrilohySection;
