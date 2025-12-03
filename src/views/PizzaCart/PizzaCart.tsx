import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../../context/CartContext';
import './PizzaCart.less';

const PizzaCart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    zip: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.street.trim()) {
      newErrors.street = 'Ulica je povinná';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Mesto je povinné';
    }
    if (!formData.zip.trim() || !/^\d{5}$/.test(formData.zip)) {
      newErrors.zip = 'PSČ musí obsahovať 5 číslic';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert('Objednávka bola úspešne odoslaná! Ďakujeme.');
      clearCart();
      navigate('/');
    }
  };

  const subtotal = getTotalPrice();
  const delivery = 2.50;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="pizza-cart">
        <Helmet>
          <title>Košík | Pohoda Skalite</title>
        </Helmet>
        <div className="container">
          <div className="pizza-cart__empty">
            <div className="pizza-cart__empty-icon">🛒</div>
            <h1 className="pizza-cart__empty-title">Váš košík je prázdny</h1>
            <p className="pizza-cart__empty-text">
              Pozrite si naše menu a vyberte si niečo chutné!
            </p>
            <Link to="/" className="pizza-cart__empty-button">
              Prejsť na menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pizza-cart">
      <Helmet>
        <title>Košík | Pohoda Skalite</title>
      </Helmet>
      
      <div className="pizza-cart__layout">
        {/* Left Column - Cart Items */}
        <div className="pizza-cart__main">          
          <div className="pizza-cart__items">
            {cart.map((item, index) => (
              <div key={`${item.pizza.id}-${index}`} className="cart-item">
                <div className="cart-item__header">
                  <h3 className="cart-item__name">{item.pizza.name}</h3>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(index)}
                    aria-label="Odstrániť"
                  >
                    ×
                  </button>
                </div>
                
                <p className="cart-item__description">{item.pizza.description}</p>
                
                {item.extras && item.extras.length > 0 && (
                  <p className="cart-item__extras">+ {item.extras.join(', ')}</p>
                )}
                
                {item.pizza.type === 'pizza' && (
                  <p className="cart-item__weight">850g</p>
                )}
                
                <div className="cart-item__footer">
                  <div className="cart-item__quantity">
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="cart-item__qty-value">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="cart-item__price">
                    {item.totalPrice.toFixed(2)} €
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Forms & Summary */}
        <div className="pizza-cart__sidebar">
          {/* Payment Method */}
          <div className="payment-method">
            <h3 className="payment-method__title">Spôsob platby</h3>
            
            <label className="payment-method__option">
              <div className="payment-method__radio">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                />
                <span className="payment-method__radio-custom"></span>
              </div>
              <div className="payment-method__content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
                <span>Hotovosť pri dodaní</span>
              </div>
            </label>

            <label className="payment-method__option">
              <div className="payment-method__radio">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <span className="payment-method__radio-custom"></span>
              </div>
              <div className="payment-method__content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span>Karta pri dodaní</span>
              </div>
            </label>
          </div>

          {/* Delivery Address */}
          <div className="delivery-address">
            <h3 className="delivery-address__title">Adresa doručenia</h3>
            
            <div className="form-group">
              <label className="form-group__label">Ulica a číslo domu</label>
              <input
                type="text"
                name="street"
                className={`form-group__input ${errors.street ? 'form-group__input--error' : ''}`}
                placeholder="Napr. Hlavná 123"
                value={formData.street}
                onChange={handleInputChange}
              />
              {errors.street && <span className="form-group__error">{errors.street}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-group__label">Mesto</label>
                <select
                  name="city"
                  className={`form-group__select ${errors.city ? 'form-group__select--error' : ''}`}
                  value={formData.city}
                  onChange={handleInputChange}
                >
                  <option value="">Vyberte mesto</option>
                  <option value="Skalité">Skalité</option>
                  <option value="Čierne">Čierne</option>
                  <option value="Svrčinovec">Svrčinovec</option>
                </select>
                {errors.city && <span className="form-group__error">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label className="form-group__label">PSČ</label>
                <input
                  type="text"
                  name="zip"
                  className={`form-group__input ${errors.zip ? 'form-group__input--error' : ''}`}
                  placeholder="12345"
                  value={formData.zip}
                  onChange={handleInputChange}
                  maxLength={5}
                />
                {errors.zip && <span className="form-group__error">{errors.zip}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-group__label">Poznámka (voliteľné)</label>
              <textarea
                name="notes"
                className="form-group__textarea"
                placeholder="Napr. poschodie, zvonček..."
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          {/* Dark Summary Card */}
          <div className="order-summary">
            <h3 className="order-summary__title">Súhrn objednávky</h3>
            
            <div className="order-summary__row">
              <span>Medzisúčet</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            
            <div className="order-summary__row">
              <span>Doprava</span>
              <span>{delivery.toFixed(2)} €</span>
            </div>
            
            <div className="order-summary__row order-summary__row--total">
              <span>Celkom</span>
              <span className="order-summary__total-price">{total.toFixed(2)} €</span>
            </div>
          </div>

          <button 
            className="checkout-button"
            onClick={handleSubmit}
          >
            POTVRDIŤ OBJEDNÁVKU
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCart;
