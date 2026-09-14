import React from 'react';
import { useLocale } from '../../../../i18n/LocaleContext';

interface ProductModalSummaryProps {
  basePrice: number;
  extrasPrice: number;
  totalPrice: number;
  isDisabled: boolean;
  onAddToCart: () => void;
}

export const ProductModalSummary: React.FC<ProductModalSummaryProps> = ({
  basePrice,
  extrasPrice,
  totalPrice,
  isDisabled,
  onAddToCart,
}) => {
  const { t, price } = useLocale();

  return (
    <div className="product-modal__summary">
      <div className="product-modal__summary-rows">
        <div className="product-modal__summary-row">
          <span className="product-modal__summary-label">
            {t('modal_base_price')}
          </span>
          <span className="product-modal__summary-value">
            {price(basePrice)}
          </span>
        </div>
        <div className="product-modal__summary-row">
          <span className="product-modal__summary-label">
            {t('modal_extras')}
          </span>
          <span className="product-modal__summary-value">
            +{price(extrasPrice)}
          </span>
        </div>
        <div className="product-modal__summary-divider" />
        <div className="product-modal__summary-row product-modal__summary-row--total">
          <span className="product-modal__summary-label">
            {t('modal_total')}
          </span>
          <span className="product-modal__summary-value product-modal__summary-value--total">
            {price(totalPrice)}
          </span>
        </div>
      </div>

      <button
        className={`product-modal__add-button ${isDisabled ? 'product-modal__add-button--disabled' : ''}`}
        onClick={onAddToCart}
        disabled={isDisabled}
      >
        {isDisabled ? t('common_unavailable_upper') : t('modal_add_to_cart')}
      </button>
    </div>
  );
};
