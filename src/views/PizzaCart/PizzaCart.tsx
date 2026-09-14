import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../../context/CartContext';
import { useLocale } from '../../i18n/LocaleContext';
import CartItem from '../../components/PizzaCart/CartItem/CartItem';
import CartIcon from '../../components/shared/CartIcon/CartIcon';
import PaymentMethodSelector from '../../components/PizzaCart/PaymentMethodSelector/PaymentMethodSelector';
import DeliveryAddressForm from '../../components/PizzaCart/DeliveryAddressForm/DeliveryAddressForm';
import OrderSummary from '../../components/PizzaCart/OrderSummary/OrderSummary';
import MinimumOrderBanner from '../../components/PizzaCart/MinimumOrderBanner/MinimumOrderBanner';
import { usePizzaCart } from './usePizzaCart';
import { requiresStreet } from './PizzaCart.helpers';
import './PizzaCart.less';

const PizzaCart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { t, locale } = useLocale();
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
    cities,
    subtotal,
    delivery,
    total,
    totalEur,
    minimumOrderMessage,
    canSubmitOrder,
    handleInputChange,
    handleDeliveryMethodChange,
    handleSubmit,
  } = usePizzaCart();

  const isOrdersDisabled = adminSettings.mode === 'disabled';
  const headTitle = `${t('cart_head_title')} | ${t('seo_site_name')}`;

  if (cart.length === 0) {
    return (
      <div className="pizza-cart">
        <Helmet>
          <title>{headTitle}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="container">
          <div className="pizza-cart__empty">
            <div className="pizza-cart__empty-icon">
              <CartIcon width="80" height="80" />
            </div>
            <h1 className="pizza-cart__empty-title">{t('cart_empty_title')}</h1>
            <p className="pizza-cart__empty-text">{t('cart_empty_text')}</p>
            <Link to="/" className="pizza-cart__empty-button">
              {t('cart_empty_button')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const showTooltip = !!minimumOrderMessage && !!formData.city;

  return (
    <div className="pizza-cart">
      <Helmet>
        <title>{headTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Link
        to="/"
        className="pizza-cart__close"
        aria-label={t('cart_close_aria')}
      >
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
            cities={cities}
            showStreet={requiresStreet(locale)}
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

          <OrderSummary
            subtotal={subtotal}
            delivery={delivery}
            total={total}
            totalEur={totalEur}
          />

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
                {t('cart_gdpr_prefix')}{' '}
                <Link to={t('privacy_path')} className="pizza-cart__gdpr-link">
                  {t('cart_gdpr_link')}
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
            className={`pizza-cart__button-wrapper ${showTooltip ? 'has-tooltip' : ''}`}
          >
            {showTooltip && (
              <div className="pizza-cart__tooltip">{minimumOrderMessage}</div>
            )}
            <button
              className="checkout-button"
              onClick={handleSubmit}
              disabled={isSubmitting || !canSubmitOrder}
            >
              {isSubmitting
                ? t('cart_submitting')
                : isOrdersDisabled
                  ? t('cart_orders_paused')
                  : t('cart_confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCart;
