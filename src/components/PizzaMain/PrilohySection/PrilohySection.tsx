import React, { useState, useCallback } from 'react';
import Toast from '../../shared/Toast/Toast';
import ProductModal from '../ProductModal/ProductModal';
import { prilohy } from '../../../data/prilohy';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { PrilohyCard } from './PrilohyCard/PrilohyCard';
import type { Product } from '../../../types';
import './PrilohySection.less';

export const PrilohySection: React.FC = () => {
  const adminSettings = useAdminSettings();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isSidesDisabled = (adminSettings.disabledProductTypes || []).includes(
    'sides',
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
      <section id="prilohy-menu" className="prilohy-section">
        <div className="container">
          <h2 className="prilohy-section__title">Prílohy</h2>
          <div className="prilohy-section__grid">
            {prilohy.map((item) => (
              <PrilohyCard
                key={item.id}
                item={item}
                isDisabled={isSidesDisabled}
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
        extras={[]}
        isDisabled={selectedItem ? isSidesDisabled : false}
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
