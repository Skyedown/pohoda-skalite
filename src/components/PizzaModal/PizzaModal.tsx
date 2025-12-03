import React, { useState, useEffect } from 'react';
import type { Pizza } from '../../types';
import { useCart } from '../../context/CartContext';
import './PizzaModal.less';

interface PizzaModalProps {
  pizza: Pizza | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (pizzaName: string) => void;
}

interface Extra {
  id: string;
  name: string;
  price: number;
}

const availableExtras: Extra[] = [
  { id: 'mozzarella', name: 'Extra mozzarella', price: 1.5 },
  { id: 'sunka', name: 'Šunka', price: 1.8 },
  { id: 'sampiony', name: 'Šampióny', price: 1.2 },
  { id: 'olivy', name: 'Olivy', price: 1.0 },
  { id: 'paradajky', name: 'Paradajky', price: 0.8 },
  { id: 'kukurica', name: 'Kukurica', price: 0.8 },
  { id: 'chilli', name: 'Čili papričky', price: 0.6 },
  { id: 'oregano', name: 'Oregano', price: 0.5 },
];

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, isOpen, onClose, onAddToCart }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
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
    }
  }, [isOpen, pizza]);

  if (!isOpen || !pizza) return null;

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
    const extra = availableExtras.find((e) => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);

  const totalPrice = (pizza.price + extrasPrice) * quantity;

  const handleAddToCartClick = () => {
    addToCart(pizza, 'medium', quantity);
    if (onAddToCart) {
      onAddToCart(pizza.name);
    }
    handleClose();
  };

  return (
    <div
      className={`pizza-modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="pizza-modal">
        <div className="pizza-modal__header">
          <button
            className="pizza-modal__close"
            onClick={handleClose}
            aria-label="Zavrieť"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <img
            src={pizza.image}
            alt={pizza.name}
            className="pizza-modal__image"
          />
        </div>

        <div className="pizza-modal__content">
          <h2 id="modal-title" className="pizza-modal__title">
            {pizza.name}
          </h2>
          <p className="pizza-modal__description">{pizza.description}</p>
          <p className="pizza-modal__weight">800g</p>

          <div className="pizza-modal__extras">
            <h3 className="pizza-modal__section-title">Pridať extra prílohy</h3>
            {availableExtras.map((extra) => (
              <div
                key={extra.id}
                className="pizza-modal__extra-item"
                onClick={() => toggleExtra(extra.id)}
              >
                <div className="pizza-modal__extra-label">
                  <div
                    className={`pizza-modal__checkbox ${
                      selectedExtras.includes(extra.id)
                        ? 'pizza-modal__checkbox--checked'
                        : ''
                    }`}
                  />
                  <span className="pizza-modal__extra-name">{extra.name}</span>
                </div>
                <span className="pizza-modal__extra-price">
                  +{extra.price.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>

          <div className="pizza-modal__quantity">
            <h3 className="pizza-modal__section-title">Počet kusov</h3>
            <div className="pizza-modal__quantity-controls">
              <button
                className="pizza-modal__quantity-button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Znížiť množstvo"
              >
                −
              </button>
              <span className="pizza-modal__quantity-value">{quantity}</span>
              <button
                className="pizza-modal__quantity-button"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                disabled={quantity >= 10}
                aria-label="Zvýšiť množstvo"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="pizza-modal__footer">
          <div className="pizza-modal__summary">
            <div className="pizza-modal__summary-row">
              <span>Základná cena</span>
              <span>{pizza.price.toFixed(2)} €</span>
            </div>
            {extrasPrice > 0 && (
              <div className="pizza-modal__summary-row">
                <span>Prísady</span>
                <span>+{extrasPrice.toFixed(2)} €</span>
              </div>
            )}
            <div className="pizza-modal__summary-row pizza-modal__summary-row--total">
              <span>Celkom</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
          <button className="pizza-modal__add-button" onClick={handleAddToCartClick}>
            Pridať do košíka
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaModal;
