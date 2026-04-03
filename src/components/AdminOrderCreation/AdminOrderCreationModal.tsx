import React, { useState, useMemo } from 'react';
import { pizzas } from '../../data/pizzas';
import { burgers } from '../../data/burgers';
import { langos } from '../../data/langos';
import { prilohy } from '../../data/prilohy';
import DeliveryAddressForm from '../Cart/DeliveryAddressForm/DeliveryAddressForm';
import PaymentMethodSelector from '../Cart/PaymentMethodSelector/PaymentMethodSelector';
import OrderSummary from '../Cart/OrderSummary/OrderSummary';
import AdminExtrasSelector from './AdminExtrasSelector';
import type { Product, Extra, DeliveryMethod } from '../../types';
import './AdminOrderCreationModal.less';

interface AdminOrderItem {
  product: Product;
  quantity: number;
  extras: Extra[];
}

interface AdminOrderCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Default extras for products
const defaultExtras: Extra[] = [
  // Meat-based extras - 1.5 EUR
  { id: 'sunka', name: 'Šunka', price: 1.5 },
  { id: 'slanina', name: 'Slanina', price: 1.5 },
  { id: 'salama', name: 'Saláma', price: 1.5 },
  { id: 'klobasa', name: 'Klobása', price: 1.5 },
  // Non-meat extras - 0.80 EUR
  { id: 'mozzarella', name: 'Extra mozzarella', price: 0.8 },
  { id: 'sampiony', name: 'Šampiňóny', price: 0.8 },
  { id: 'cierne-olivy', name: 'Čierne olivy', price: 0.8 },
  { id: 'rukola', name: 'Rukola', price: 0.8 },
  { id: 'chilli', name: 'Chilli papričky', price: 0.8 },
  { id: 'cervena-cibula', name: 'Červená cibuľa', price: 0.8 },
  { id: 'kukurica', name: 'Kukurica', price: 0.8 },
  { id: 'ananas', name: 'Ananás', price: 0.8 },
  { id: 'cherry-paradajky', name: 'Cherry paradajky', price: 0.8 },
];

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
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    phone: '',
    email: '',
    notes: '',
    deliveryMethod,
  });
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

  const categoryLabels: Record<string, string> = {
    pizza: 'Pizzy',
    burger: 'Burgery',
    langos: 'Langoš',
    sides: 'Prílohy',
  };

  // Calculate totals
  const subtotal = useMemo(
    () =>
      orderItems.reduce((sum, item) => {
        const extrasPrice = item.extras.reduce(
          (esum, extra) => esum + extra.price,
          0,
        );
        return sum + (item.product.price + extrasPrice) * item.quantity;
      }, 0),
    [orderItems],
  );

  const deliveryFee = orderType === 'dine-in' ? 0 : (deliveryMethod === 'delivery' ? 2.0 : 0);
  const total = subtotal + deliveryFee;

  // Handle adding/removing products
  const handleProductClick = (product: Product) => {
    setOrderItems((prev) => {
      // Only merge with an existing row that has no extras
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.extras.length === 0,
      );
      if (existingIndex !== -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1, extras: [] }];
    });
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
    setEditingItemIndex(itemIndex);
    setTempSelectedExtras(
      orderItems[itemIndex].extras.map((extra) => extra.id),
    );
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
      const selectedExtrasObjects = tempSelectedExtras.map(
        (extraId) => defaultExtras.find((e) => e.id === extraId)!,
      );

      setOrderItems((prev) => {
        const item = prev[editingItemIndex];
        if (!item) return prev;

        // When quantity > 1 and extras change, split into two rows:
        // one row keeps (quantity - 1) with old extras,
        // new row gets quantity 1 with new extras.
        const extrasChanged =
          JSON.stringify(item.extras.map((e) => e.id).sort()) !==
          JSON.stringify([...tempSelectedExtras].sort());

        if (item.quantity > 1 && extrasChanged) {
          const reducedItem = { ...item, quantity: item.quantity - 1 };
          const newItem = {
            ...item,
            quantity: 1,
            extras: selectedExtrasObjects,
          };
          return [
            ...prev.slice(0, editingItemIndex),
            reducedItem,
            newItem,
            ...prev.slice(editingItemIndex + 1),
          ];
        }

        return prev.map((value, idx) =>
          idx === editingItemIndex
            ? { ...value, extras: selectedExtrasObjects }
            : value,
        );
      });

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    setDeliveryMethod(method);
    setFormData((prev) => ({ ...prev, deliveryMethod: method }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // For dine-in orders, only validate that items are selected
    if (orderType === 'dine-in') {
      if (orderItems.length === 0) {
        newErrors.items = 'Musíte vybrať aspoň jeden produkt';
      }
    } else {
      // For customer orders, validate all fields
      if (!formData.fullName.trim()) newErrors.fullName = 'Meno je povinné';
      if (!formData.phone.trim()) newErrors.phone = 'Telefón je povinný';

      if (deliveryMethod === 'delivery') {
        if (!formData.street.trim()) newErrors.street = 'Ulica je povinná';
        if (!formData.city.trim()) newErrors.city = 'Mesto je povinné';
      }

      if (orderItems.length === 0) {
        newErrors.items = 'Musíte vybrať aspoň jeden produkt';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const order = {
      items: orderItems.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          type: item.product.type,
        },
        quantity: item.quantity,
        extras: item.extras,
        totalPrice:
          (item.product.price +
            item.extras.reduce((sum, e) => sum + e.price, 0)) *
          item.quantity,
      })),
      delivery: orderType === 'dine-in' ? {
        method: 'dine-in' as const,
        notes: formData.notes,
      } : {
        method: deliveryMethod,
        fullName: formData.fullName,
        street: deliveryMethod === 'delivery' ? formData.street : undefined,
        city: deliveryMethod === 'delivery' ? formData.city : undefined,
        phone: formData.phone,
        email: formData.email || undefined,
        notes: formData.notes,
      },
      payment: {
        method: paymentMethod,
      },
      pricing: {
        subtotal: subtotal,
        delivery: orderType === 'dine-in' ? 0 : deliveryFee,
        total: orderType === 'dine-in' ? subtotal : total,
      },
      createdBy: 'admin',
    };

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
      setFormData({
        fullName: '',
        street: '',
        city: '',
        phone: '',
        email: '',
        notes: '',
        deliveryMethod: 'delivery',
      });
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
          <form onSubmit={handleSubmit} className="admin-order-modal__form">
            {/* Order Type Selection */}
            <div className="admin-order-modal__section">
              <h3 className="admin-order-modal__section-title">Typ objednávky</h3>
              <div className="admin-order-modal__order-type">
                <label className="admin-order-modal__order-type-option">
                  <input
                    type="radio"
                    name="orderType"
                    value="dine-in"
                    checked={orderType === 'dine-in'}
                    onChange={(e) => setOrderType(e.target.value as 'dine-in')}
                  />
                  <div className="admin-order-modal__order-type-content">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                      <line x1="6" y1="1" x2="6" y2="4" />
                      <line x1="10" y1="1" x2="10" y2="4" />
                      <line x1="14" y1="1" x2="14" y2="4" />
                    </svg>
                    <span className="admin-order-modal__order-type-label">
                      Konzumácia v reštaurácii
                    </span>
                  </div>
                </label>
                <label className="admin-order-modal__order-type-option">
                  <input
                    type="radio"
                    name="orderType"
                    value="customer"
                    checked={orderType === 'customer'}
                    onChange={(e) => setOrderType(e.target.value as 'customer')}
                  />
                  <div className="admin-order-modal__order-type-content">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <span className="admin-order-modal__order-type-label">
                      Objednávka so zákazníckymi údajmi
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Product Selection */}
            <div className="admin-order-modal__section">
              <h3 className="admin-order-modal__section-title">
                Výber produktov
              </h3>
              {errors.items && (
                <p className="admin-order-modal__error">{errors.items}</p>
              )}

              {Object.entries(productsByCategory).map(
                ([categoryKey, products]) => (
                  <div
                    key={categoryKey}
                    className="admin-order-modal__category"
                  >
                    <h4 className="admin-order-modal__category-title">
                      {categoryLabels[categoryKey]}
                    </h4>
                    <div className="admin-order-modal__product-grid">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="admin-order-modal__product-card"
                          onClick={() => handleProductClick(product)}
                        >
                          <h5 className="admin-order-modal__product-name">
                            {product.name}
                          </h5>
                          <p className="admin-order-modal__product-price">
                            {product.price.toFixed(2)} €
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Order Items Summary */}
            {orderItems.length > 0 && (
              <div className="admin-order-modal__section">
                <h3 className="admin-order-modal__section-title">
                  Vybrané položky
                </h3>
                <div className="admin-order-modal__items-list">
                  {orderItems.map((item, itemIndex) => {
                    const extrasPrice = item.extras.reduce(
                      (sum, extra) => sum + extra.price,
                      0,
                    );
                    const itemTotal =
                      (item.product.price + extrasPrice) * item.quantity;
                    return (
                      <div
                        key={`${item.product.id}-${itemIndex}`}
                        className={`admin-order-modal__item-row ${editingItemIndex === itemIndex ? 'admin-order-modal__item-row--editing' : ''}`}
                      >
                        <div className="admin-order-modal__item-info">
                          <p className="admin-order-modal__item-name">
                            {item.product.name}
                          </p>
                          {item.extras.length > 0 && (
                            <p className="admin-order-modal__item-extras">
                              + {item.extras.map((e) => e.name).join(', ')}
                            </p>
                          )}
                          <p className="admin-order-modal__item-price">
                            {item.product.price.toFixed(2)} €{' '}
                            {item.extras.length > 0 &&
                              `+ ${extrasPrice.toFixed(2)} €`}{' '}
                            ×{' '}
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  itemIndex,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="admin-order-modal__quantity-input"
                            />
                          </p>
                        </div>
                        <div className="admin-order-modal__item-total">
                          {itemTotal.toFixed(2)} €
                        </div>
                        <div className="admin-order-modal__item-actions">
                          <button
                            type="button"
                            className="admin-order-modal__edit-btn"
                            onClick={() => handleEditExtras(itemIndex)}
                          >
                            Prílohy
                          </button>
                          <button
                            type="button"
                            className="admin-order-modal__remove-btn"
                            onClick={() => handleQuantityChange(itemIndex, 0)}
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Extras Selector Panel */}
                        {editingItemIndex === itemIndex && (
                          <div className="admin-order-modal__extras-panel">
                            <AdminExtrasSelector
                              extras={defaultExtras}
                              selectedExtras={tempSelectedExtras}
                              onToggleExtra={handleToggleExtra}
                              onConfirm={handleConfirmExtras}
                              onCancel={handleCancelExtras}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Details Form - only show for customer orders */}
            {orderType === 'customer' && (
              <div className="admin-order-modal__section">
                <h3 className="admin-order-modal__section-title">
                  Detaily objednávky
                </h3>

                {/* Delivery/Pickup Selection */}
                <DeliveryAddressForm
                  formData={formData}
                  errors={errors}
                  onChange={handleFormChange}
                  onDeliveryMethodChange={handleDeliveryMethodChange}
                  hideEmail={true}
                />

                {/* Payment Method */}
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  deliveryMethod={deliveryMethod}
                />

                {/* Order Summary */}
                {orderItems.length > 0 && (
                  <OrderSummary
                    subtotal={subtotal}
                    delivery={deliveryFee}
                    total={total}
                  />
                )}
              </div>
            )}

            {/* For dine-in orders, show simplified summary */}
            {orderType === 'dine-in' && orderItems.length > 0 && (
              <div className="admin-order-modal__section">
                <h3 className="admin-order-modal__section-title">
                  Súhrn objednávky
                </h3>

                {/* Notes field for dine-in */}
                <div className="form-group">
                  <label className="form-group__label">Poznámka (voliteľné)</label>
                  <textarea
                    name="notes"
                    className="form-group__textarea"
                    placeholder="Napr. číslo stola, špeciálne požiadavky..."
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={3}
                  />
                </div>

                <OrderSummary
                  subtotal={subtotal}
                  delivery={0}
                  total={subtotal}
                />
              </div>
            )}

            {/* Submit Button */}
            {errors.submit && (
              <p className="admin-order-modal__error">{errors.submit}</p>
            )}
            <div className="admin-order-modal__actions">
              <button
                type="submit"
                className="admin-order-modal__submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Ukladám…' : 'Vytvoriť objednávku'}
              </button>
              <button
                type="button"
                className="admin-order-modal__cancel-btn"
                onClick={onClose}
              >
                Zrušiť
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderCreationModal;
