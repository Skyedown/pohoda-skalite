import React from 'react';
import { formatWaitTime, type AnnouncementMode } from '../../utils/adminSettings';
import './OrderOverloadModal.less';

interface OrderOverloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: AnnouncementMode;
  waitTimeMinutes?: number;
  customNote?: string;
}

const OrderOverloadModal: React.FC<OrderOverloadModalProps> = ({
  isOpen,
  onClose,
  mode = 'disabled',
  waitTimeMinutes = 60,
  customNote = ''
}) => {
  if (!isOpen) return null;

  const isWaitTimeMode = mode === 'waitTime';
  const isCustomNoteMode = mode === 'customNote';

  return (
    <div className="order-overload-modal-overlay" onClick={onClose}>
      <div className="order-overload-modal" onClick={(e) => e.stopPropagation()}>
        <button className="order-overload-modal__close" onClick={onClose} aria-label="Zavrieť">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="order-overload-modal__icon">
          {isWaitTimeMode ? (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <h2 className="order-overload-modal__title">
          {isCustomNoteMode
            ? 'Oznámenie'
            : isWaitTimeMode
            ? 'Informácia o čakacej dobe'
            : 'Online objednávky dočasne pozastavené'}
        </h2>

        {isCustomNoteMode ? (
          <>
            <p className="order-overload-modal__message">
              {customNote}
            </p>
          </>
        ) : isWaitTimeMode ? (
          <>
            <p className="order-overload-modal__message">
              Z dôvodu veľkého počtu objednávok je čakacia doba momentálne{' '}
              <strong className="order-overload-modal__highlight">
                {formatWaitTime(waitTimeMinutes)}
              </strong>.
            </p>

            <p className="order-overload-modal__message">
              Vaša objednávka bude pripravená v predpokladanom čase. Ďakujeme za pochopenie a trpezlivosť!
            </p>
          </>
        ) : (
          <>
            <p className="order-overload-modal__message">
              Z dôvodu veľkého počtu objednávok sme momentálne nútení pozastaviť prijímanie nových online objednávok.
            </p>

            <p className="order-overload-modal__message">
              Ďakujeme za pochopenie a ospravedlňujeme sa za nepríjemnosti. Skúste to prosím neskôr alebo nás kontaktujte telefonicky.
            </p>
          </>
        )}

        <div className="order-overload-modal__contact">
          <p>{isWaitTimeMode || isCustomNoteMode ? 'Máte otázky?' : 'Pre viac informácií'} Kontaktujte nás telefonicky:</p>
          <a href={`tel:${import.meta.env.VITE_RESTAURANT_PHONE || '+421918175571'}`} className="order-overload-modal__phone">
            {import.meta.env.VITE_RESTAURANT_PHONE || '+421 918 175 571'}
          </a>
        </div>

        <button className="order-overload-modal__button" onClick={onClose}>
          {isWaitTimeMode || isCustomNoteMode ? 'Pokračovať v objednávke' : 'Rozumiem'}
        </button>
      </div>
    </div>
  );
};

export default OrderOverloadModal;
