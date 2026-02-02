import React from 'react';
import './OrderOverloadModal.less';

interface OrderOverloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderOverloadModal: React.FC<OrderOverloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="order-overload-modal-overlay" onClick={onClose}>
      <div className="order-overload-modal" onClick={(e) => e.stopPropagation()}>
        <button className="order-overload-modal__close" onClick={onClose} aria-label="Zavrieť">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="order-overload-modal__icon">⚠️</div>

        <h2 className="order-overload-modal__title">
          Online objednávky dočasne pozastavené
        </h2>

        <p className="order-overload-modal__message">
          Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok.
        </p>

        <p className="order-overload-modal__message">
          Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.
        </p>

        <div className="order-overload-modal__contact">
          <p>Pre viac informácií nás môžete kontaktovať telefonicky:</p>
          <a href={`tel:${import.meta.env.VITE_RESTAURANT_PHONE || '+421918175571'}`} className="order-overload-modal__phone">
            {import.meta.env.VITE_RESTAURANT_PHONE || '+421 918 175 571'}
          </a>
        </div>

        <button className="order-overload-modal__button" onClick={onClose}>
          Rozumiem
        </button>
      </div>
    </div>
  );
};

export default OrderOverloadModal;
