import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import { useOrderingStatus } from '../../hooks/useOrderingStatus';
import { useLocale } from '../../i18n/LocaleContext';
import { config } from '../../config';
import { toEur } from '../../i18n/format';
import { sanitizeCartForm, type CartFormData } from '../../utils/sanitize';
import { trackPurchase } from '../../utils/analytics';
import {
  getDeliveryRule,
  getMinimumOrderShortfall,
  isMinimumOrderMet,
} from '../../utils/deliveryRules';
import type { DeliveryMethod } from '../../types';
import {
  validateCartForm,
  scrollToFirstError,
  buildOrderPayload,
  requiresStreet,
} from './PizzaCart.helpers';

const INITIAL_FORM_DATA: CartFormData = {
  fullName: '',
  street: '',
  houseNumber: '',
  city: '',
  phone: '',
  email: '',
  notes: '',
};

export function usePizzaCart() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, getTotalPriceEur, clearCart } = useCart();
  const adminSettings = useAdminSettings();
  const orderingStatus = useOrderingStatus();
  const { locale, currency, t, price } = useLocale();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>(
    locale === 'pl' ? 'card' : 'cash',
  );
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>('delivery');
  const [formData, setFormData] = useState<CartFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  const cities = adminSettings.deliveryCities[locale];

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      // Slovak house numbers are plain digits; Polish ones can be 12A or 34/2.
      const sanitizedValue =
        name === 'houseNumber' && !requiresStreet(locale)
          ? value.replace(/[^0-9]/g, '')
          : value;
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors, locale],
  );

  const handleDeliveryMethodChange = useCallback((method: DeliveryMethod) => {
    setDeliveryMethod(method);
    if (method === 'pickup') {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.city;
        delete next.street;
        delete next.houseNumber;
        return next;
      });
    }
  }, []);

  const subtotal = useMemo(() => getTotalPrice(), [getTotalPrice]);
  const subtotalEur = useMemo(() => getTotalPriceEur(), [getTotalPriceEur]);
  const deliveryRule = useMemo(
    () => getDeliveryRule(cities, formData.city),
    [cities, formData.city],
  );
  const delivery = deliveryMethod === 'pickup' ? 0 : deliveryRule.fee;
  const deliveryEur = toEur(delivery, currency);
  const total = subtotal + delivery;
  const totalEur = subtotalEur + deliveryEur;

  const minimumOrderMessage = useMemo(() => {
    if (deliveryMethod !== 'delivery') return null;
    const shortfall = getMinimumOrderShortfall(cities, formData.city, subtotal);
    if (!shortfall) return null;

    return t('min_order_message', {
      city: shortfall.rule.displayName,
      minOrder: price(shortfall.rule.minOrder),
      remaining: price(shortfall.remaining),
    });
  }, [deliveryMethod, cities, formData.city, subtotal, t, price]);

  const canSubmitOrder = useMemo(
    () =>
      (deliveryMethod === 'pickup' ||
        isMinimumOrderMet(cities, formData.city, subtotal)) &&
      orderingStatus.canOrder &&
      adminSettings.mode !== 'disabled',
    [
      deliveryMethod,
      cities,
      formData.city,
      subtotal,
      orderingStatus.canOrder,
      adminSettings.mode,
    ],
  );

  const handleSubmit = useCallback(async () => {
    const formErrors = validateCartForm(
      formData,
      deliveryMethod,
      gdprConsent,
      locale,
      t,
    );
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      scrollToFirstError(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const order = buildOrderPayload({
        cart,
        formData: sanitizeCartForm(formData),
        deliveryMethod,
        paymentMethod,
        subtotal,
        delivery,
        total,
        subtotalEur,
        deliveryEur,
        totalEur,
        locale,
        currency,
      });

      trackPurchase({
        transactionId: `order-${Date.now()}`,
        value: total,
        currency,
        locale,
        items: cart.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.nameSk,
          item_category: item.product.type,
          price: item.totalPrice,
          quantity: item.quantity,
        })),
      });

      try {
        await fetch(`${config.apiUrl}/api/send-order-emails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order }),
        });
      } catch {
        // Email service unavailable but order was processed
      }

      clearCart();
      navigate('/thank-you');
    } catch {
      alert(t('cart_submit_error'));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    deliveryMethod,
    gdprConsent,
    locale,
    currency,
    t,
    cart,
    paymentMethod,
    subtotal,
    delivery,
    total,
    subtotalEur,
    deliveryEur,
    totalEur,
    clearCart,
    navigate,
  ]);

  return {
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
    subtotalEur,
    deliveryEur,
    totalEur,
    minimumOrderMessage,
    canSubmitOrder,
    handleInputChange,
    handleDeliveryMethodChange,
    handleSubmit,
  };
}
