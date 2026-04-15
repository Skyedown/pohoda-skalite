import React from 'react';

interface ProductModalQuantityProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

export const ProductModalQuantity: React.FC<ProductModalQuantityProps> = ({
  quantity,
  onDecrement,
  onIncrement,
}) => (
  <div className="product-modal__quantity-section">
    <h3 className="product-modal__section-title">Počet kusov</h3>
    <div className="product-modal__quantity-controls">
      <button
        className="product-modal__quantity-btn"
        onClick={onDecrement}
        disabled={quantity <= 1}
        aria-label="Znížiť množstvo"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 10H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <span className="product-modal__quantity-value">{quantity}</span>
      <button
        className="product-modal__quantity-btn"
        onClick={onIncrement}
        disabled={quantity >= 10}
        aria-label="Zvýšiť množstvo"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 5V15M5 10H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
);
