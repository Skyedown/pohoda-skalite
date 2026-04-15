import React, { useState, useCallback } from 'react';
import Toast from '../../shared/Toast/Toast';
import ProductModal from '../ProductModal/ProductModal';
import { langos } from '../../../data/langos';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { langosExtras } from './LangosSection.helpers';
import { LangosCard } from './LangosCard/LangosCard';
import type { Product } from '../../../types';
import './LangosSection.less';

export const LangosSection: React.FC = () => {
  const adminSettings = useAdminSettings();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isLangosDisabled = (adminSettings.disabledProductTypes || []).includes(
    'langos',
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
      <section id="langos-menu" className="langos-section">
        <div className="container">
          <p className="langos-section__subtitle">Chrumkavé a chutné</p>
          <h2 className="langos-section__title">Langoše</h2>
          <div className="langos-section__grid">
            {langos.map((item) => (
              <LangosCard
                key={item.id}
                item={item}
                isDisabled={isLangosDisabled}
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
        extras={langosExtras}
        isDisabled={selectedItem ? isLangosDisabled : false}
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
