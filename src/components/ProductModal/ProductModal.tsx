import React, { useState, useEffect } from 'react';
import type { Pizza, Extra, RequiredOption } from '../../types';
import { useCart } from '../../context/CartContext';
import RequiredOptionSelect from '../RequiredOptionSelect';
import { formatAllergens } from '../../constants/allergens';
import './ProductModal.less';

interface ProductModalProps {
  product: Pizza | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (productName: string) => void;
  extras?: Extra[];
  requiredOption?: RequiredOption;
}

const defaultPizzaExtras: Extra[] = [
  // Meat-based extras - 1.5 EUR
  { id: 'sunka', name: 'Šunka', price: 1.5 },
  { id: 'slanina', name: 'Slanina', price: 1.5 },
  { id: 'salama', name: 'Saláma', price: 1.5 },
  { id: 'klobasa', name: 'Klobása', price: 1.5 },
  // Non-meat extras - 0.80 EUR
  { id: 'mozzarella', name: 'Extra mozzarella', price: 0.80 },
  { id: 'sampiony', name: 'Šampióny', price: 0.80 },
  { id: 'cierne-olivy', name: 'Čierne olivy', price: 0.80 },
  { id: 'rukola', name: 'Rukola', price: 0.80 },
  { id: 'chilli', name: 'Chilli papričky', price: 0.80 },
  { id: 'cervena-cibula', name: 'Červená cibuľa', price: 0.80 },
  { id: 'kukurica', name: 'Kukurica', price: 0.80 },
  { id: 'ananas', name: 'Ananás', price: 0.80 },
  { id: 'cherry-paradajky', name: 'Cherry paradajky', price: 0.80 },
];

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  extras = defaultPizzaExtras,
  requiredOption,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedRequiredOption, setSelectedRequiredOption] = useState<string>('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedExtras([]);
      setSelectedRequiredOption(requiredOption?.options[0]?.id || '');
    }
  }, [isOpen, product, requiredOption]);

  if (!isOpen || !product) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const extrasPrice = selectedExtras.reduce((sum, extraId) => {
    const extra = extras.find((e) => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);

  const totalPrice = (product.price + extrasPrice) * quantity;

  const handleAddToCartClick = () => {
    // Validate required option if present
    if (requiredOption && !selectedRequiredOption) {
      alert(`Prosím, vyberte ${requiredOption.label.toLowerCase()}`);
      return;
    }

    const selectedExtrasObjects = selectedExtras.map(
      (extraId) => extras.find((e) => e.id === extraId)!
    );

    const requiredOptionData = requiredOption && selectedRequiredOption
      ? {
          name: requiredOption.name,
          selectedValue: requiredOption.options.find((opt) => opt.id === selectedRequiredOption)?.label || '',
        }
      : undefined;

    addToCart(product, quantity, selectedExtrasObjects, requiredOptionData);
    if (onAddToCart) {
      onAddToCart(product.name);
    }
    handleClose();
  };

  return (
    <div
      className={`product-modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`product-modal product-modal--${product.type}`}>
        <button
          className="product-modal__close"
          onClick={handleClose}
          aria-label="Zavrieť"
        >
          ✕
        </button>

        {/* Header with Product Image - Desktop only (side by side) */}
        <div className="product-modal__header product-modal__header--desktop">
          <div className="product-modal__image-container">
            <img
              src={product.image}
              alt={product.name}
              className="product-modal__image"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="product-modal__right">
          {/* Content */}
          <div className="product-modal__content">

          {/* Header with Product Image - Mobile/Tablet (inside scroll) */}
          <div className="product-modal__header product-modal__header--mobile">
            <div className="product-modal__image-container">
              <img
                src={product.image}
                alt={product.name}
                className="product-modal__image"
              />
            </div>
          </div>

          <div className="product-modal__content-inner">
          {/* Product Info */}
          <div className="product-modal__info">
            <h2 id="modal-title" className="product-modal__name">
              {product.name}
              {product.spicy && (
                <img
                  src="/icons/chilli.svg"
                  alt="Spicy"
                  className="product-modal__spicy-icon"
                />
              )}
            </h2>
            <p className="product-modal__description">{product.ingredients?.join(', ')}</p>
            {product.weight && (
              <p className="product-modal__weight">
                {product.weight}
              </p>
            )}
            {product.allergens && product.allergens.length > 0 && (
              <p className="product-modal__allergens">
                <strong>Alergény:</strong> <span className="product-modal__allergens-list">{formatAllergens(product.allergens, true)}</span>
              </p>
            )}
          </div>

          {/* Required Option Section */}
          {requiredOption && (
            <RequiredOptionSelect
              requiredOption={requiredOption}
              selectedValue={selectedRequiredOption}
              onChange={setSelectedRequiredOption}
            />
          )}

          {/* Extras Section */}
          {extras.length > 0 && (
            <div className="product-modal__extras-section">
              <h3 className="product-modal__section-title">Pridať extra prílohy</h3>

              <div className="product-modal__extras-container">
                <div className="product-modal__extras-list">
                  {extras.map((extra) => {
                    const isSelected = selectedExtras.includes(extra.id);
                    return (
                      <label
                        key={extra.id}
                        className={`product-modal__extra-item ${
                          isSelected ? 'product-modal__extra-item--selected' : ''
                        }`}
                      >
                        <div className="product-modal__extra-checkbox-wrapper">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleExtra(extra.id)}
                            className="product-modal__extra-checkbox"
                          />
                          <span className="product-modal__extra-checkbox-custom">
                            {isSelected && (
                              <svg
                                width="10"
                                height="8"
                                viewBox="0 0 10 8"
                                fill="none"
                              >
                                <path
                                  d="M1 4L3.5 6.5L9 1"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="product-modal__extra-name">
                            {extra.name}
                          </span>
                        </div>
                        <span className="product-modal__extra-price">
                          +{extra.price.toFixed(2)} €
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quantity Section */}
          <div className="product-modal__quantity-section">
            <h3 className="product-modal__section-title">Počet kusov</h3>
            <div className="product-modal__quantity-controls">
              <button
                className="product-modal__quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
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
          </div>
        </div>

        {/* Bottom Summary Section */}
        <div className="product-modal__summary">
          <div className="product-modal__summary-rows">
            <div className="product-modal__summary-row">
              <span className="product-modal__summary-label">Základná cena</span>
              <span className="product-modal__summary-value">
                {product.price.toFixed(2)} €
              </span>
            </div>
            <div className="product-modal__summary-row">
              <span className="product-modal__summary-label">Prísady</span>
              <span className="product-modal__summary-value">
                +{extrasPrice.toFixed(2)} €
              </span>
            </div>
            <div className="product-modal__summary-divider"></div>
            <div className="product-modal__summary-row product-modal__summary-row--total">
              <span className="product-modal__summary-label">Celkom</span>
              <span className="product-modal__summary-value product-modal__summary-value--total">
                {totalPrice.toFixed(2)} €
              </span>
            </div>
          </div>

          <button
            className="product-modal__add-button"
            onClick={handleAddToCartClick}
          >
            PRIDAŤ DO KOŠÍKA
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
