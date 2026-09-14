import React from 'react';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { useLocale } from '../../../i18n/LocaleContext';
import type { DeliveryMethod } from '../../../types';
import './PaymentMethodSelector.less';

interface PaymentMethodSelectorProps {
  value: 'cash' | 'card';
  onChange: (value: 'cash' | 'card') => void;
  deliveryMethod?: DeliveryMethod;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
  deliveryMethod = 'delivery',
}) => {
  const adminSettings = useAdminSettings();
  const { t, locale } = useLocale();

  // Poland is card-only, so cash is not offered there and the card option is
  // always available — the admin toggles below govern the Slovak site.
  const isCardOnly = locale === 'pl';

  const isCardPaymentEnabled =
    isCardOnly ||
    (deliveryMethod === 'delivery' &&
      adminSettings.cardPaymentDeliveryEnabled) ||
    (deliveryMethod === 'pickup' && adminSettings.cardPaymentPickupEnabled);

  return (
    <div className="payment-method">
      <h3 className="payment-method__title">{t('payment_title')}</h3>

      {!isCardOnly && (
        <label className="payment-method__option">
          <div className="payment-method__radio">
            <input
              type="radio"
              name="payment"
              checked={value === 'cash'}
              onChange={() => onChange('cash')}
            />
            <span className="payment-method__radio-custom"></span>
          </div>
          <div className="payment-method__content">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M6 12h.01M18 12h.01" />
            </svg>
            <span>{t('payment_cash')}</span>
          </div>
        </label>
      )}

      <label
        className={`payment-method__option ${
          isCardPaymentEnabled ? '' : 'payment-method__option--disabled'
        }`}
      >
        <div className="payment-method__radio">
          <input
            type="radio"
            name="payment"
            checked={value === 'card'}
            onChange={() => onChange('card')}
            disabled={!isCardPaymentEnabled}
          />
          <span className="payment-method__radio-custom"></span>
        </div>
        <div className="payment-method__content">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <span>{t('payment_card')}</span>
        </div>
        {!isCardPaymentEnabled && (
          <span className="payment-method__badge">
            {t('payment_unavailable')}
          </span>
        )}
      </label>

      {isCardOnly && (
        <p className="payment-method__note">{t('payment_terminal_note')}</p>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
