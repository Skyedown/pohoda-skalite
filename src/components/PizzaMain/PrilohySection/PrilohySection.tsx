import React, { useState, useCallback } from 'react';
import Toast from '../../shared/Toast/Toast';
import ProductModal from '../ProductModal/ProductModal';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { usePrilohy } from '../../../hooks/useMenu';
import { useLocale } from '../../../i18n/LocaleContext';
import { isProductDisabled } from '../../../utils/productAvailability';
import { PrilohyCard } from './PrilohyCard/PrilohyCard';
import type { LocalizedProduct } from '../../../types';
import './PrilohySection.less';

export const PrilohySection: React.FC = () => {
  const adminSettings = useAdminSettings();
  const { t } = useLocale();
  const prilohy = usePrilohy();
  const [selectedItem, setSelectedItem] = useState<LocalizedProduct | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleOpenModal = useCallback((item: LocalizedProduct) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  }, []);

  const handleItemAddedToCart = useCallback(
    (itemName: string) => {
      setToastMessage(t('product_added_toast', { name: itemName }));
      setShowToast(true);
    },
    [t],
  );

  return (
    <>
      <section id="prilohy-menu" className="prilohy-section">
        <div className="container">
          <h2 className="prilohy-section__title">{t('section_sides_title')}</h2>
          <div className="prilohy-section__grid">
            {prilohy.map((item) => (
              <PrilohyCard
                key={item.id}
                item={item}
                isDisabled={isProductDisabled(item, adminSettings)}
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
        isDisabled={
          selectedItem ? isProductDisabled(selectedItem, adminSettings) : false
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
