import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import { sanitizeCartForm, type CartFormData } from '../../utils/sanitize';
import { getOrderingStatus } from '../../utils/orderingStatus';
import { trackPurchase } from '../../utils/analytics';
import {
  getDeliveryRule,
  getMinimumOrderMessage,
  isMinimumOrderMet,
} from '../../utils/deliveryRules';
import type { DeliveryMethod } from '../../types';
import {
  validateCartForm,
  scrollToFirstError,
  buildOrderPayload,
} from './PizzaCart.helpers';

const INITIAL_FORM_DATA: CartFormData = {
  fullName: '',
  houseNumber: '',
  city: '',
  phone: '',
  email: '',
  notes: '',
};

export function usePizzaCart() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const adminSettings = useAdminSettings();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>('delivery');
  const [formData, setFormData] = useState<CartFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canOrder, setCanOrder] = useState(getOrderingStatus().canOrder);
  const [gdprConsent, setGdprConsent] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCanOrder(getOrderingStatus().canOrder);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      const sanitizedValue =
        name === 'houseNumber' ? value.replace(/[^0-9]/g, '') : value;
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors],
  );

  const handleDeliveryMethodChange = useCallback((method: DeliveryMethod) => {
    setDeliveryMethod(method);
    if (method === 'pickup') {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.city;
        delete next.houseNumber;
        return next;
      });
    }
  }, []);

  const subtotal = useMemo(() => getTotalPrice(), [getTotalPrice]);
  const deliveryRule = useMemo(
    () => getDeliveryRule(formData.city),
    [formData.city],
  );
  const delivery = deliveryMethod === 'pickup' ? 0 : deliveryRule.fee;
  const total = subtotal + delivery;

  const minimumOrderMessage = useMemo(
    () =>
      deliveryMethod === 'delivery'
        ? getMinimumOrderMessage(formData.city, subtotal)
        : null,
    [deliveryMethod, formData.city, subtotal],
  );

  const canSubmitOrder = useMemo(
    () =>
      (deliveryMethod === 'pickup' ||
        isMinimumOrderMet(formData.city, subtotal)) &&
      canOrder &&
      adminSettings.mode !== 'disabled',
    [deliveryMethod, formData.city, subtotal, canOrder, adminSettings.mode],
  );

  const handleSubmit = useCallback(async () => {
    const formErrors = validateCartForm(formData, deliveryMethod, gdprConsent);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      scrollToFirstError(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedFormData = sanitizeCartForm(formData);
      const order = buildOrderPayload(
        cart,
        sanitizedFormData,
        deliveryMethod,
        paymentMethod,
        subtotal,
        delivery,
        total,
      );

      trackPurchase({
        transactionId: `order-${Date.now()}`,
        value: total,
        currency: 'EUR',
        items: cart.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          item_category: item.product.type,
          price: item.totalPrice,
          quantity: item.quantity,
        })),
      });

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://pizzapohoda.sk';
        await fetch(`${apiUrl}/api/send-order-emails`, {
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
      alert(
        'Vyskytla sa chyba pri spracovaní objednávky. Skúste to prosím znova.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    deliveryMethod,
    gdprConsent,
    cart,
    paymentMethod,
    subtotal,
    delivery,
    total,
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
    subtotal,
    delivery,
    total,
    minimumOrderMessage,
    canSubmitOrder,
    handleInputChange,
    handleDeliveryMethodChange,
    handleSubmit,
  };
}
