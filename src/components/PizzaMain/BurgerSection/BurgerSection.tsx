import React, { useState, useCallback } from 'react';
import Toast from '../../shared/Toast/Toast';
import ProductModal from '../ProductModal/ProductModal';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { useBurgers, useLocalizedExtras } from '../../../hooks/useMenu';
import { useLocale } from '../../../i18n/LocaleContext';
import { isProductDisabled } from '../../../utils/productAvailability';
import { burgerExtras } from './BurgerSection.helpers';
import { BurgerCard } from './BurgerCard/BurgerCard';
import type { LocalizedProduct } from '../../../types';
import './BurgerSection.less';

export const BurgerSection: React.FC = () => {
  const adminSettings = useAdminSettings();
  const { t } = useLocale();
  const burgers = useBurgers();
  const extras = useLocalizedExtras(burgerExtras);
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
      <section id="burger-menu" className="burger-section">
        <div className="container">
          <h2 className="burger-section__title">
            {t('section_burgers_title')}
          </h2>
          <div className="burger-section__grid">
            {burgers.map((item) => (
              <BurgerCard
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
        extras={extras}
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

export default BurgerSection;
