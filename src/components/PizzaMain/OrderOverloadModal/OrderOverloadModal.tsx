import React from 'react';
import { useLocale } from '../../../i18n/LocaleContext';
import { formatWaitTime } from '../../../utils/waitTime';
import { COMPANY, formatPhone } from '../../../constants/company';
import type { AnnouncementMode } from '../../../utils/adminSettings';
import {
  OverloadModalIcon,
  type OverloadIconVariant,
} from './OverloadModalIcon';
import './OrderOverloadModal.less';

interface OrderOverloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AnnouncementMode;
  waitTimeMinutes: number;
  customNote: string;
  customNoteImageUrl: string;
  customNoteOrderingEnabled: boolean;
  disabledReason: string;
}

const OrderOverloadModal: React.FC<OrderOverloadModalProps> = ({
  isOpen,
  onClose,
  mode,
  waitTimeMinutes,
  customNote,
  customNoteImageUrl,
  customNoteOrderingEnabled,
  disabledReason,
}) => {
  const { t, locale } = useLocale();

  if (!isOpen) return null;

  const isWaitTimeMode = mode === 'waitTime';
  const isCustomNoteMode = mode === 'customNote';
  const canContinue =
    isWaitTimeMode || (isCustomNoteMode && customNoteOrderingEnabled);
  const imageUrl = isCustomNoteMode ? customNoteImageUrl : '';

  const title = isCustomNoteMode
    ? t('overload_title_note')
    : isWaitTimeMode
      ? t('overload_title_wait')
      : t('overload_title_disabled');

  let iconVariant: OverloadIconVariant = 'warning';
  if (isWaitTimeMode) iconVariant = 'clock';
  else if (canContinue) iconVariant = 'info';

  return (
    <div className="order-overload-modal-overlay" onClick={onClose}>
      <div
        className="order-overload-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="order-overload-modal__close"
          onClick={onClose}
          aria-label={t('common_close')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="order-overload-modal__image"
            decoding="async"
          />
        ) : (
          <div className="order-overload-modal__icon">
            <OverloadModalIcon variant={iconVariant} />
          </div>
        )}

        <h2 className="order-overload-modal__title">{title}</h2>

        {isCustomNoteMode ? (
          <p className="order-overload-modal__message">{customNote}</p>
        ) : isWaitTimeMode ? (
          <>
            <p className="order-overload-modal__message">
              {t('overload_wait_message')}{' '}
              <strong className="order-overload-modal__highlight">
                {formatWaitTime(waitTimeMinutes, locale, t)}
              </strong>
              .
            </p>
            <p className="order-overload-modal__message">
              {t('overload_wait_message_2')}
            </p>
          </>
        ) : (
          <p className="order-overload-modal__message">{disabledReason}</p>
        )}

        <div className="order-overload-modal__contact">
          <p>
            {isWaitTimeMode || isCustomNoteMode
              ? t('overload_contact_questions')
              : t('overload_contact_more_info')}{' '}
            {t('overload_contact_call')}
          </p>
          <a
            href={`tel:${COMPANY.phone}`}
            className="order-overload-modal__phone"
          >
            {formatPhone(COMPANY.phone)}
          </a>
        </div>

        <button className="order-overload-modal__button" onClick={onClose}>
          {canContinue ? t('overload_continue') : t('overload_understood')}
        </button>
      </div>
    </div>
  );
};

export default OrderOverloadModal;
