import React, { useState, useCallback } from 'react';
import Toast from '../../shared/Toast/Toast';
import ProductModal from '../ProductModal/ProductModal';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { useLangos, useLocalizedExtras } from '../../../hooks/useMenu';
import { useLocale } from '../../../i18n/LocaleContext';
import { isProductDisabled } from '../../../utils/productAvailability';
import { langosExtras } from './LangosSection.helpers';
import { LangosCard } from './LangosCard/LangosCard';
import type { LocalizedProduct } from '../../../types';
import './LangosSection.less';

export const LangosSection: React.FC = () => {
  const adminSettings = useAdminSettings();
  const { t } = useLocale();
  const langos = useLangos();
  const extras = useLocalizedExtras(langosExtras);
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
      <section id="langos-menu" className="langos-section">
        <div className="container">
          <p className="langos-section__subtitle">
            {t('section_langos_subtitle')}
          </p>
          <h2 className="langos-section__title">{t('section_langos_title')}</h2>
          <div className="langos-section__grid">
            {langos.map((item) => (
              <LangosCard
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

export default LangosSection;
