import React from 'react';
import { useLocale } from '../../../i18n/LocaleContext';
import { formatWaitTime } from '../../../utils/waitTime';
import { COMPANY, formatPhone } from '../../../constants/company';
import type { AnnouncementMode } from '../../../utils/adminSettings';
import './OrderOverloadModal.less';

interface OrderOverloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AnnouncementMode;
  waitTimeMinutes: number;
  customNote: string;
  disabledReason: string;
}

const OrderOverloadModal: React.FC<OrderOverloadModalProps> = ({
  isOpen,
  onClose,
  mode,
  waitTimeMinutes,
  customNote,
  disabledReason,
}) => {
  const { t, locale } = useLocale();

  if (!isOpen) return null;

  const isWaitTimeMode = mode === 'waitTime';
  const isCustomNoteMode = mode === 'customNote';

  const title = isCustomNoteMode
    ? t('overload_title_note')
    : isWaitTimeMode
      ? t('overload_title_wait')
      : t('overload_title_disabled');

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

        <div className="order-overload-modal__icon">
          {isWaitTimeMode ? (
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline
                points="12 6 12 12 16 14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="9"
                x2="12"
                y2="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="17"
                x2="12.01"
                y2="17"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

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
          {isWaitTimeMode || isCustomNoteMode
            ? t('overload_continue')
            : t('overload_understood')}
        </button>
      </div>
    </div>
  );
};

export default OrderOverloadModal;
