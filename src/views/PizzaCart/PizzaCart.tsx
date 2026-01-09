import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/Cart/CartItem/CartItem';
import PaymentMethodSelector from '../../components/Cart/PaymentMethodSelector/PaymentMethodSelector';
import DeliveryAddressForm from '../../components/Cart/DeliveryAddressForm/DeliveryAddressForm';
import OrderSummary from '../../components/Cart/OrderSummary/OrderSummary';
import { sanitizeCartForm } from '../../utils/sanitize';
import { getOrderingStatus } from '../../utils/orderingStatus';
import { trackPurchase } from '../../utils/analytics';
import './PizzaCart.less';

const PizzaCart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canOrder, setCanOrder] = useState(getOrderingStatus().canOrder);
  const [gdprConsent, setGdprConsent] = useState(false);

  // Scroll to top when cart view opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Update ordering status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCanOrder(getOrderingStatus().canOrder);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefónne číslo je povinné';
    } else if (!/^[+]?[\d\s()-]{9,}$/.test(formData.phone)) {
      newErrors.phone = 'Zadajte platné telefónne číslo';
    }
    // Email is required
    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Zadajte platnú emailovú adresu';
    }
    if (!gdprConsent) {
      newErrors.gdprConsent = 'Musíte súhlasiť so spracovaním osobných údajov';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Sanitize form data to prevent XSS and injection attacks
      const sanitizedFormData = sanitizeCartForm(formData);

      // Create comprehensive order object
      const order = {
        items: cart.map(item => ({
          id: item.pizza.id,
          name: item.pizza.name,
          type: item.pizza.type,
          size: item.size,
          quantity: item.quantity,
          basePrice: item.pizza.price,
          extras: item.extras?.map(extra => ({
            id: extra.id,
            name: extra.name,
            price: extra.price
          })) || [],
          extrasPrice: item.extrasPrice || 0,
          totalPrice: item.totalPrice
        })),
        pricing: {
          subtotal: subtotal,
          delivery: delivery,
          total: total
        },
        delivery: {
          street: sanitizedFormData.street,
          city: sanitizedFormData.city,
          phone: sanitizedFormData.phone,
          email: sanitizedFormData.email,
          notes: sanitizedFormData.notes
        },
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString()
      };

      // Track purchase conversion in GA4 & Meta Pixel
      trackPurchase({
        transactionId: `order-${Date.now()}`,
        value: total,
        currency: 'EUR',
        items: cart.map(item => ({
          item_id: item.pizza.id,
          item_name: item.pizza.name,
          item_category: item.pizza.type,
          price: item.totalPrice,
          quantity: item.quantity,
        })),
      });

      // Try to send order emails via API (non-blocking)
      try {
        const response = await fetch('http://localhost:3001/api/send-order-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order }),
        });

        // Silently handle email errors
        if (!response.ok) {
          // Email failed but order was processed
        }
      } catch (emailError) {
        // Email service unavailable but order was processed
      }

      // Always clear cart and redirect
      clearCart();
      navigate('/thank-you');
    } catch (error) {
      alert('Vyskytla sa chyba pri spracovaní objednávky. Skúste to prosím znova.');
    } finally {
      setIsSubmitting(false);
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

      {/* Close button */}
      <Link to="/" className="pizza-cart__close" aria-label="Zavrieť košík">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <div className="pizza-cart__layout">
        {/* Left Column - Cart Items */}
        <div className="pizza-cart__main">
          <div className="pizza-cart__items">
            {cart.map((item, index) => (
              <CartItem
                key={`${item.pizza.id}-${index}`}
                item={item}
                index={index}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Forms & Summary */}
        <div className="pizza-cart__sidebar">
          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          <DeliveryAddressForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />

          <OrderSummary
            subtotal={subtotal}
            delivery={delivery}
            total={total}
          />

          <div className="pizza-cart__gdpr-consent">
            <label className="pizza-cart__gdpr-label">
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => {
                  setGdprConsent(e.target.checked);
                  if (errors.gdprConsent) {
                    setErrors(prev => ({ ...prev, gdprConsent: '' }));
                  }
                }}
                className="pizza-cart__gdpr-checkbox"
              />
              <span className="pizza-cart__gdpr-text">
                Súhlasím so spracovaním{' '}
                <Link to="/ochrana-osobnych-udajov" className="pizza-cart__gdpr-link">
                  osobných údajov
                </Link>
              </span>
            </label>
            {errors.gdprConsent && (
              <span className="pizza-cart__gdpr-error">{errors.gdprConsent}</span>
            )}
          </div>

          <button
            className="checkout-button"
            onClick={handleSubmit}
            disabled={isSubmitting || !canOrder}
          >
            {isSubmitting ? 'ODOSIELAM...' : 'POTVRDIŤ OBJEDNÁVKU'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCart;
