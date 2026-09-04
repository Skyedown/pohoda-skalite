import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { pizzas } from '../../data/pizzas';
import { burgers } from '../../data/burgers';
import { langos } from '../../data/langos';
import { prilohy } from '../../data/prilohy';
import { capovane } from '../../data/capovane';
import { drinks } from '../../data/drinks';
import { snacks } from '../../data/snacks';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import { isProductDisabled } from '../../utils/productAvailability';
import OrderFormSection from './OrderFormSection/OrderFormSection';
import OrderSidebar from './OrderSidebar/OrderSidebar';
import AdminIngredientsModal from './AdminIngredientsModal';
import type { Product, DeliveryMethod } from '../../types';
import {
  getExtrasForProductType,
  categoryLabels,
  calculateSubtotal,
  validateOrderForm,
  buildOrderPayload,
  getInitialFormState,
  addProductToOrder,
  lookupCustomers,
  applyCustomerMatch,
  type AdminOrderItem,
  type CustomerMatch,
} from './adminHelpers';
import './AdminOrderCreationModal.less';

export interface EditOrderData {
  _id: string;
  items: {
    product: { id?: string; name: string; price: number; type?: string };
    quantity: number;
    extras: { id?: string; name: string; price: number }[];
    removedIngredients?: string[];
    totalPrice: number;
  }[];
  delivery: {
    method: 'delivery' | 'pickup' | 'dine-in';
    fullName?: string;
    street?: string;
    houseNumber?: string;
    city?: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
  payment: { method: 'cash' | 'card' };
  pricing: { subtotal: number; delivery: number; total: number };
}

interface AdminOrderCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  editOrder?: EditOrderData | null;
  onSaved?: () => void;
}

const AdminOrderCreationModal: React.FC<AdminOrderCreationModalProps> = ({
  isOpen,
  onClose,
  editOrder = null,
  onSaved,
}) => {
  const [orderItems, setOrderItems] = useState<AdminOrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [orderType, setOrderType] = useState<'dine-in' | 'customer'>(
    'customer',
  );
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>('delivery');
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingIngredientsIndex, setEditingIngredientsIndex] = useState<
    number | null
  >(null);
  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerMatches, setCustomerMatches] = useState<CustomerMatch[]>([]);
  const [lookupField, setLookupField] = useState<'fullName' | 'phone' | null>(
    null,
  );

  const API_URL = import.meta.env.VITE_API_URL || '';
  const adminSettings = useAdminSettings();

  // Organize products by category, hiding items that are disabled (out of stock)
  const productsByCategory = useMemo(
    () => ({
      pizza: pizzas.filter((p) => !isProductDisabled(p, adminSettings)),
      burger: burgers.filter((p) => !isProductDisabled(p, adminSettings)),
      langos: langos.filter((p) => !isProductDisabled(p, adminSettings)),
      sides: prilohy.filter((p) => !isProductDisabled(p, adminSettings)),
      capovane: capovane.filter((p) => !isProductDisabled(p, adminSettings)),
      drinks: drinks.filter((p) => !isProductDisabled(p, adminSettings)),
      snacks: snacks.filter((p) => !isProductDisabled(p, adminSettings)),
    }),
    [adminSettings],
  );

  // All products flat list for resolving order items (unfiltered, for editing existing orders)
  const allProducts = useMemo(
    () => [
      ...pizzas,
      ...burgers,
      ...langos,
      ...prilohy,
      ...capovane,
      ...drinks,
      ...snacks,
    ],
    [],
  );

  // Reset form when modal is closed, or populate when editing
  useEffect(() => {
    if (!isOpen) {
      setOrderItems([]);
      setFormData(getInitialFormState());
      setPaymentMethod('cash');
      setOrderType('customer');
      setDeliveryMethod('delivery');
      setErrors({});
      setEditingItemIndex(null);
      setEditingIngredientsIndex(null);
      setCustomerMatches([]);
      setLookupField(null);
    } else if (editOrder) {
      // Populate form from existing order
      const items: AdminOrderItem[] = editOrder.items.map((item) => {
        const fullProduct = allProducts.find(
          (p) => p.id === item.product.id || p.name === item.product.name,
        );
        return {
          product: fullProduct || {
            id: item.product.id || item.product.name,
            name: item.product.name,
            price: item.product.price,
            image: '',
            type: (item.product.type as Product['type']) || 'pizza',
          },
          quantity: item.quantity,
          extras: (item.extras || []).map((e) => ({
            id: e.id || e.name,
            name: e.name,
            price: e.price,
          })),
          removedIngredients: item.removedIngredients || [],
        };
      });
      setOrderItems(items);

      const isOrderDineIn = editOrder.delivery.method === 'dine-in';
      setOrderType(isOrderDineIn ? 'dine-in' : 'customer');
      setDeliveryMethod(editOrder.delivery.method);
      setPaymentMethod(editOrder.payment.method);
      setFormData({
        fullName: editOrder.delivery.fullName || '',
        houseNumber:
          editOrder.delivery.houseNumber || editOrder.delivery.street || '',
        city: editOrder.delivery.city || '',
        phone: editOrder.delivery.phone || '',
        email: editOrder.delivery.email || '',
        notes: editOrder.delivery.notes || '',
        deliveryMethod: editOrder.delivery.method,
      });
    }
  }, [isOpen, editOrder, allProducts]);

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

  // Suggest returning customers from past orders as the admin types contact details
  useEffect(() => {
    if (!isOpen || orderType !== 'customer' || editOrder) {
      setCustomerMatches([]);
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    const name = formData.fullName.trim();
    const query = {
      phone: phoneDigits.length >= 5 ? formData.phone : '',
      name: name.length >= 3 ? name : '',
    };

    if (!query.phone && !query.name) {
      setCustomerMatches([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      lookupCustomers(API_URL, query, controller.signal)
        .then(setCustomerMatches)
        .catch(() => setCustomerMatches([]));
    }, 400);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    isOpen,
    orderType,
    editOrder,
    formData.phone,
    formData.fullName,
    API_URL,
  ]);

  const handleApplyCustomerMatch = useCallback((match: CustomerMatch) => {
    const patch = applyCustomerMatch(match);
    setFormData((prev) => ({ ...prev, ...patch }));
    if (patch.deliveryMethod) setDeliveryMethod(patch.deliveryMethod);
    setCustomerMatches([]);
    setLookupField(null);
  }, []);

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
    } else {
      setEditingItemIndex(itemIndex);
    }
  };

  const handleToggleExtra = (extraId: string) => {
    if (editingItemIndex === null) return;

    setOrderItems((prev) => {
      const item = prev[editingItemIndex];
      if (!item) return prev;

      // Get the correct extras for this product type
      const availableExtras = getExtrasForProductType(item.product.type);

      const currentExtraIds = item.extras.map((e) => e.id);
      const newExtraIds = currentExtraIds.includes(extraId)
        ? currentExtraIds.filter((id) => id !== extraId)
        : [...currentExtraIds, extraId];

      const newExtras = newExtraIds
        .map((id) => availableExtras.find((e) => e.id === id))
        .filter((e): e is (typeof availableExtras)[0] => e !== undefined);

      // If quantity > 1 and extras changed, split the row
      const extrasChanged =
        JSON.stringify(currentExtraIds.sort()) !==
        JSON.stringify(newExtraIds.sort());

      if (item.quantity > 1 && extrasChanged) {
        const reducedItem = { ...item, quantity: item.quantity - 1 };
        const newItem = { ...item, quantity: 1, extras: newExtras };
        return [
          ...prev.slice(0, editingItemIndex),
          reducedItem,
          newItem,
          ...prev.slice(editingItemIndex + 1),
        ];
      } else {
        return prev.map((orderItem, idx) =>
          idx === editingItemIndex
            ? { ...orderItem, extras: newExtras }
            : orderItem,
        );
      }
    });
  };

  const handleCloseExtras = () => {
    setEditingItemIndex(null);
  };

  const handleEditIngredients = (itemIndex: number) => {
    setEditingIngredientsIndex(itemIndex);
  };

  const handleToggleIngredient = (ingredient: string) => {
    if (editingIngredientsIndex === null) return;

    setOrderItems((prev) => {
      const item = prev[editingIngredientsIndex];
      if (!item) return prev;

      const currentRemoved = item.removedIngredients || [];
      const newRemoved = currentRemoved.includes(ingredient)
        ? currentRemoved.filter((i) => i !== ingredient)
        : [...currentRemoved, ingredient];

      return prev.map((orderItem, idx) =>
        idx === editingIngredientsIndex
          ? { ...orderItem, removedIngredients: newRemoved }
          : orderItem,
      );
    });
  };

  const handleCloseIngredients = () => {
    setEditingIngredientsIndex(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === 'fullName' || name === 'phone') {
      setLookupField(name);
    }

    // For houseNumber, only allow numeric values
    if (name === 'houseNumber') {
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
      const url = editOrder
        ? `${API_URL}/api/orders/${editOrder._id}`
        : `${API_URL}/api/orders`;
      const method = editOrder ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
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
      setOrderType('customer');
      setDeliveryMethod('delivery');
      setErrors({});
      setEditingItemIndex(null);
      if (onSaved) onSaved();
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
          <h2>{editOrder ? 'Úprava objednávky' : 'Vytvorenie objednávky'}</h2>
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
              customerMatches={customerMatches}
              lookupField={lookupField}
              onOrderTypeChange={setOrderType}
              onProductClick={handleProductClick}
              onFormChange={handleFormChange}
              onDeliveryMethodChange={handleDeliveryMethodChange}
              onPaymentMethodChange={setPaymentMethod}
              onApplyCustomerMatch={handleApplyCustomerMatch}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Right Column - Order Summary Sidebar */}
          <div className="admin-order-modal__right">
            <OrderSidebar
              orderItems={orderItems}
              editingItemIndex={editingItemIndex}
              subtotal={subtotal}
              deliveryFee={orderType === 'dine-in' ? 0 : deliveryFee}
              total={orderType === 'dine-in' ? subtotal : total}
              isSubmitting={isSubmitting}
              isEditing={!!editOrder}
              submitError={errors.submit}
              onQuantityChange={handleQuantityChange}
              onEditExtras={handleEditExtras}
              onToggleExtra={handleToggleExtra}
              onCloseExtras={handleCloseExtras}
              onEditIngredients={handleEditIngredients}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Ingredients Modal */}
        {editingIngredientsIndex !== null &&
          orderItems[editingIngredientsIndex] &&
          orderItems[editingIngredientsIndex].product.ingredients && (
            <AdminIngredientsModal
              productName={orderItems[editingIngredientsIndex].product.name}
              ingredients={
                orderItems[editingIngredientsIndex].product.ingredients || []
              }
              removedIngredients={
                orderItems[editingIngredientsIndex].removedIngredients || []
              }
              onToggleIngredient={handleToggleIngredient}
              onClose={handleCloseIngredients}
            />
          )}
      </div>
    </div>
  );
};

export default AdminOrderCreationModal;
