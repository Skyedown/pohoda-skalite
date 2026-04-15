import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Product, Extra } from '../../../types';
import { useCart } from '../../../context/CartContext';
import { formatAllergens } from '../../../constants/allergens';
import { ProductModalExtras } from './ProductModalExtras/ProductModalExtras';
import { ProductModalQuantity } from './ProductModalQuantity/ProductModalQuantity';
import { ProductModalSummary } from './ProductModalSummary/ProductModalSummary';
import {
  defaultPizzaExtras,
  calculateExtrasPrice,
  calculateTotalPrice,
} from './ProductModal.helpers';
import './ProductModal.less';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (productName: string) => void;
  extras?: Extra[];
  isDisabled?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  extras = defaultPizzaExtras,
  isDisabled = false,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const extrasSectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToExtras = useCallback(() => {
    if (extrasSectionRef.current && contentRef.current) {
      const offset = extrasSectionRef.current.offsetTop;
      contentRef.current.scrollTo({ top: offset - 16, behavior: 'smooth' });
    }
  }, []);

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
      setRemovedIngredients([]);
    }
  }, [isOpen, product]);

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
        : [...prev, extraId],
    );
  };

  const toggleIngredient = (ingredient: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient],
    );
  };

  const extrasPrice = calculateExtrasPrice(selectedExtras, extras);
  const totalPrice = calculateTotalPrice(product.price, extrasPrice, quantity);

  const handleAddToCartClick = () => {
    // Prevent adding to cart if product is disabled
    if (isDisabled) {
      alert('Táto položka nie je momentálne dostupná');
      return;
    }

    const selectedExtrasObjects = selectedExtras.map(
      (extraId) => extras.find((e) => e.id === extraId)!,
    );

    addToCart(product, quantity, selectedExtrasObjects, removedIngredients);
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
          <div className="product-modal__content" ref={contentRef}>
            {/* Header with Product Image - Mobile/Tablet (inside scroll) */}
            <div className="product-modal__header product-modal__header--mobile">
              <div className="product-modal__image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-modal__image"
                />
              </div>
              {product.ingredients && product.ingredients.length > 0 && (
                <button
                  className="product-modal__scroll-ingredients-btn"
                  onClick={scrollToExtras}
                  type="button"
                >
                  Upraviť ingrediencie
                </button>
              )}
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
                <p className="product-modal__description">
                  {product.ingredients?.join(', ')}
                </p>
                {product.weight && (
                  <p className="product-modal__weight">{product.weight}</p>
                )}
                {product.allergens && product.allergens.length > 0 && (
                  <p className="product-modal__allergens">
                    <strong>Alergény:</strong>{' '}
                    <span className="product-modal__allergens-list">
                      {formatAllergens(product.allergens, true)}
                    </span>
                  </p>
                )}
              </div>

              {/* Extras Section */}
              {(extras.length > 0 ||
                (product.type !== 'sides' &&
                  product.ingredients &&
                  product.ingredients.length > 0)) && (
                <div ref={extrasSectionRef}>
                  <ProductModalExtras
                    extras={extras}
                    selectedExtras={selectedExtras}
                    ingredients={product.ingredients || []}
                    removedIngredients={removedIngredients}
                    productType={product.type}
                    onToggleExtra={toggleExtra}
                    onToggleIngredient={toggleIngredient}
                  />
                </div>
              )}

              <ProductModalQuantity
                quantity={quantity}
                onDecrement={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrement={() => setQuantity(Math.min(10, quantity + 1))}
              />
            </div>
          </div>

          <ProductModalSummary
            basePrice={product.price}
            extrasPrice={extrasPrice}
            totalPrice={totalPrice}
            isDisabled={isDisabled}
            onAddToCart={handleAddToCartClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
