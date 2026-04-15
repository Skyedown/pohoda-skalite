import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/PizzaCart/CartItem/CartItem';
import CartIcon from '../../components/shared/CartIcon/CartIcon';
import PaymentMethodSelector from '../../components/PizzaCart/PaymentMethodSelector/PaymentMethodSelector';
import DeliveryAddressForm from '../../components/PizzaCart/DeliveryAddressForm/DeliveryAddressForm';
import OrderSummary from '../../components/PizzaCart/OrderSummary/OrderSummary';
import MinimumOrderBanner from '../../components/PizzaCart/MinimumOrderBanner/MinimumOrderBanner';
import { isMinimumOrderMet } from '../../utils/deliveryRules';
import { usePizzaCart } from './usePizzaCart';
import './PizzaCart.less';

const PizzaCart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const {
    formData,
    errors,
    setErrors,
    paymentMethod,
    setPaymentMethod,
    deliveryMethod,
    gdprConsent,
    setGdprConsent,
    isSubmitting,
    adminSettings,
    subtotal,
    delivery,
    total,
    minimumOrderMessage,
    canSubmitOrder,
    handleInputChange,
    handleDeliveryMethodChange,
    handleSubmit,
  } = usePizzaCart();

  const isOrdersDisabled = adminSettings.mode === 'disabled';

  if (cart.length === 0) {
    return (
      <div className="pizza-cart">
        <Helmet>
          <title>Košík | Pohoda Skalite</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="container">
          <div className="pizza-cart__empty">
            <div className="pizza-cart__empty-icon">
              <CartIcon width="80" height="80" />
            </div>
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
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Link to="/" className="pizza-cart__close" aria-label="Zavrieť košík">
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
      </Link>

      <div className="pizza-cart__layout">
        <div className="pizza-cart__main">
          <div className="pizza-cart__items">
            {cart.map((item, index) => (
              <CartItem
                key={`${item.product?.id || 'unknown'}-${index}`}
                item={item}
                index={index}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          {minimumOrderMessage && (
            <MinimumOrderBanner
              message={minimumOrderMessage}
              className="pizza-cart__banner--desktop"
            />
          )}
        </div>

        <div className="pizza-cart__sidebar">
          <DeliveryAddressForm
            formData={{ ...formData, deliveryMethod }}
            errors={errors}
            onChange={handleInputChange}
            onDeliveryMethodChange={handleDeliveryMethodChange}
          />

          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
            deliveryMethod={deliveryMethod}
          />

          {minimumOrderMessage && (
            <MinimumOrderBanner
              message={minimumOrderMessage}
              className="pizza-cart__banner--mobile"
            />
          )}

          <OrderSummary subtotal={subtotal} delivery={delivery} total={total} />

          <div
            className={`pizza-cart__gdpr-consent gdpr-consent ${
              errors.gdprConsent ? 'pizza-cart__gdpr-consent--error' : ''
            }`}
          >
            <label className="pizza-cart__gdpr-label">
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => {
                  setGdprConsent(e.target.checked);
                  if (errors.gdprConsent) {
                    setErrors((prev) => ({ ...prev, gdprConsent: '' }));
                  }
                }}
                className="pizza-cart__gdpr-checkbox"
              />
              <span className="pizza-cart__gdpr-text">
                Súhlasím so spracovaním{' '}
                <Link
                  to="/ochrana-osobnych-udajov"
                  className="pizza-cart__gdpr-link"
                >
                  osobných údajov
                </Link>
              </span>
            </label>
            {errors.gdprConsent && (
              <span className="pizza-cart__gdpr-error">
                {errors.gdprConsent}
              </span>
            )}
          </div>

          <div
            className={`pizza-cart__button-wrapper ${
              !isMinimumOrderMet(formData.city, subtotal) && formData.city
                ? 'has-tooltip'
                : ''
            }`}
          >
            {!isMinimumOrderMet(formData.city, subtotal) && formData.city ? (
              <div className="pizza-cart__tooltip">{minimumOrderMessage}</div>
            ) : null}
            <button
              className="checkout-button"
              onClick={handleSubmit}
              disabled={isSubmitting || !canSubmitOrder}
            >
              {isSubmitting
                ? 'ODOSIELAM...'
                : isOrdersDisabled
                  ? 'OBJEDNÁVKY POZASTAVENÉ'
                  : 'POTVRDIŤ OBJEDNÁVKU'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCart;
