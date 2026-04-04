import React, { useState, useMemo, useEffect } from 'react';
import { pizzas } from '../../data/pizzas';
import { burgers } from '../../data/burgers';
import { langos } from '../../data/langos';
import { prilohy } from '../../data/prilohy';
import OrderFormSection from './OrderFormSection/OrderFormSection';
import OrderSidebar from './OrderSidebar/OrderSidebar';
import type { Product, DeliveryMethod } from '../../types';
import {
  defaultExtras,
  categoryLabels,
  calculateSubtotal,
  validateOrderForm,
  buildOrderPayload,
  getInitialFormState,
  addProductToOrder,
  confirmExtras,
  type AdminOrderItem,
} from './adminHelpers';
import './AdminOrderCreationModal.less';

interface AdminOrderCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminOrderCreationModal: React.FC<AdminOrderCreationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [orderItems, setOrderItems] = useState<AdminOrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [orderType, setOrderType] = useState<'dine-in' | 'customer'>('dine-in');
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>('delivery');
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [tempSelectedExtras, setTempSelectedExtras] = useState<string[]>([]);
  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '';

  // Organize products by category
  const productsByCategory = useMemo(
    () => ({
      pizza: pizzas,
      burger: burgers,
      langos: langos,
      sides: prilohy,
    }),
    [],
  );

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setOrderItems([]);
      setFormData(getInitialFormState());
      setPaymentMethod('cash');
      setOrderType('dine-in');
      setDeliveryMethod('delivery');
      setErrors({});
      setEditingItemIndex(null);
      setTempSelectedExtras([]);
    }
  }, [isOpen]);

  // Disable body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Calculate totals
  const subtotal = useMemo(() => calculateSubtotal(orderItems), [orderItems]);

  const deliveryFee = 0; // Delivery is always free
  const total = subtotal + deliveryFee;

  // Handle adding/removing products
  const handleProductClick = (product: Product) => {
    setOrderItems((prev) => addProductToOrder(prev, product));
  };

  const handleQuantityChange = (itemIndex: number, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems((prev) => prev.filter((_, idx) => idx !== itemIndex));
      // Adjust editing index if needed
      if (editingItemIndex !== null) {
        if (editingItemIndex === itemIndex) {
          setEditingItemIndex(null);
          setTempSelectedExtras([]);
        } else if (editingItemIndex > itemIndex) {
          setEditingItemIndex(editingItemIndex - 1);
        }
      }
    } else {
      setOrderItems((prev) =>
        prev.map((item, idx) =>
          idx === itemIndex ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const handleEditExtras = (itemIndex: number) => {
    // Toggle: if already editing this item, close it
    if (editingItemIndex === itemIndex) {
      setEditingItemIndex(null);
      setTempSelectedExtras([]);
    } else {
      setEditingItemIndex(itemIndex);
      setTempSelectedExtras(
        orderItems[itemIndex].extras.map((extra) => extra.id),
      );
    }
  };

  const handleToggleExtra = (extraId: string) => {
    setTempSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId],
    );
  };

  const handleConfirmExtras = () => {
    if (editingItemIndex !== null) {
      setOrderItems((prev) =>
        confirmExtras(
          prev,
          editingItemIndex,
          tempSelectedExtras,
          defaultExtras,
        ),
      );
      setEditingItemIndex(null);
      setTempSelectedExtras([]);
    }
  };

  const handleCancelExtras = () => {
    setEditingItemIndex(null);
    setTempSelectedExtras([]);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // For street (house number), only allow numeric values
    if (name === 'street') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    setDeliveryMethod(method);
    setFormData((prev) => ({ ...prev, deliveryMethod: method }));
  };

  const validateForm = (): boolean => {
    const newErrors = validateOrderForm(
      orderType,
      formData,
      deliveryMethod,
      orderItems,
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const order = buildOrderPayload(
      orderItems,
      orderType,
      formData,
      deliveryMethod,
      paymentMethod,
      subtotal,
      deliveryFee,
    );

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      // Reset form
      setOrderItems([]);
      setFormData(getInitialFormState());
      setPaymentMethod('cash');
      setOrderType('dine-in');
      setDeliveryMethod('delivery');
      setErrors({});
      setEditingItemIndex(null);
      setTempSelectedExtras([]);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setErrors((prev) => ({
        ...prev,
        submit: `Chyba pri ukladaní objednávky: ${msg}`,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-order-modal-overlay" onClick={onClose}>
      <div className="admin-order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-order-modal__header">
          <h2>Vytvorenie objednávky</h2>
          <button
            className="admin-order-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="admin-order-modal__content">
          {/* Left Column - Scrollable Product Selection */}
          <div className="admin-order-modal__left">
            <OrderFormSection
              orderType={orderType}
              productsByCategory={productsByCategory}
              categoryLabels={categoryLabels}
              formData={formData}
              errors={errors}
              deliveryMethod={deliveryMethod}
              paymentMethod={paymentMethod}
              onOrderTypeChange={setOrderType}
              onProductClick={handleProductClick}
              onFormChange={handleFormChange}
              onDeliveryMethodChange={handleDeliveryMethodChange}
              onPaymentMethodChange={setPaymentMethod}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Right Column - Order Summary Sidebar */}
          <div className="admin-order-modal__right">
            <OrderSidebar
              orderItems={orderItems}
              editingItemIndex={editingItemIndex}
              tempSelectedExtras={tempSelectedExtras}
              defaultExtras={defaultExtras}
              subtotal={subtotal}
              deliveryFee={orderType === 'dine-in' ? 0 : deliveryFee}
              total={orderType === 'dine-in' ? subtotal : total}
              isSubmitting={isSubmitting}
              submitError={errors.submit}
              onQuantityChange={handleQuantityChange}
              onEditExtras={handleEditExtras}
              onToggleExtra={handleToggleExtra}
              onConfirmExtras={handleConfirmExtras}
              onCancelExtras={handleCancelExtras}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderCreationModal;
