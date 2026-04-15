import React from 'react';

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
}) => (
  <div className="product-modal__summary">
    <div className="product-modal__summary-rows">
      <div className="product-modal__summary-row">
        <span className="product-modal__summary-label">Základná cena</span>
        <span className="product-modal__summary-value">
          {basePrice.toFixed(2)} €
        </span>
      </div>
      <div className="product-modal__summary-row">
        <span className="product-modal__summary-label">Prísady</span>
        <span className="product-modal__summary-value">
          +{extrasPrice.toFixed(2)} €
        </span>
      </div>
      <div className="product-modal__summary-divider" />
      <div className="product-modal__summary-row product-modal__summary-row--total">
        <span className="product-modal__summary-label">Celkom</span>
        <span className="product-modal__summary-value product-modal__summary-value--total">
          {totalPrice.toFixed(2)} €
        </span>
      </div>
    </div>

    <button
      className={`product-modal__add-button ${isDisabled ? 'product-modal__add-button--disabled' : ''}`}
      onClick={onAddToCart}
      disabled={isDisabled}
    >
      {isDisabled ? 'NEDOSTUPNÉ' : 'PRIDAŤ DO KOŠÍKA'}
    </button>
  </div>
);
