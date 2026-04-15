import React, { useState, useCallback } from 'react';
import Toast from '../../shared/Toast/Toast';
import ProductModal from '../ProductModal/ProductModal';
import { burgers } from '../../../data/burgers';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { burgerExtras } from './BurgerSection.helpers';
import { BurgerCard } from './BurgerCard/BurgerCard';
import type { Product } from '../../../types';
import './BurgerSection.less';

export const BurgerSection: React.FC = () => {
  const adminSettings = useAdminSettings();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isBurgerDisabled = (adminSettings.disabledProductTypes || []).includes(
    'burger',
  );

  const handleOpenModal = useCallback((item: Product) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  }, []);

  const handleItemAddedToCart = useCallback((itemName: string) => {
    setToastMessage(`${itemName} pridaný do košíka!`);
    setShowToast(true);
  }, []);

  return (
    <>
      <section id="burger-menu" className="burger-section">
        <div className="container">
          <h2 className="burger-section__title">Burgre</h2>
          <div className="burger-section__grid">
            {burgers.map((item) => (
              <BurgerCard
                key={item.id}
                item={item}
                isDisabled={isBurgerDisabled}
                onClick={handleOpenModal}
              />
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
        isDisabled={selectedItem ? isBurgerDisabled : false}
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
