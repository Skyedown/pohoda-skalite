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

  const deliveryFee = deliveryMethod === 'delivery' ? 2.0 : 0;
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

    if (!formData.fullName.trim()) newErrors.fullName = 'Meno je povinné';
    if (!formData.phone.trim()) newErrors.phone = 'Telefón je povinný';
    if (!formData.email.trim()) newErrors.email = 'Email je povinný';

    if (deliveryMethod === 'delivery') {
      if (!formData.street.trim()) newErrors.street = 'Ulica je povinná';
      if (!formData.city.trim()) newErrors.city = 'Mesto je povinné';
    }

    if (orderItems.length === 0) {
      newErrors.items = 'Musíte vybrať aspoň jeden produkt';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Admin order submit triggered');

    if (!validateForm()) {
      console.error('❌ Form validation failed:', errors);
      return;
    }

    console.log('✅ Form validation passed');
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
      delivery: {
        method: deliveryMethod,
        fullName: formData.fullName,
        street: deliveryMethod === 'delivery' ? formData.street : undefined,
        city: deliveryMethod === 'delivery' ? formData.city : undefined,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
      },
      payment: {
        method: paymentMethod,
      },
      pricing: {
        subtotal: subtotal,
        delivery: deliveryFee,
        total: total,
      },
      createdBy: 'admin',
    };

    setIsSubmitting(true);
    console.log('📤 Sending order to API:', `${API_URL}/api/orders`);
    console.log('📦 Order payload:', JSON.stringify(order, null, 2));
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('❌ API responded with error:', res.status, data);
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Order saved successfully:', data);

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
      setDeliveryMethod('delivery');
      setErrors({});
      setEditingItemIndex(null);
      setTempSelectedExtras([]);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Order submission failed:', msg);
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

            {/* Order Details Form */}
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

            {/* Submit Button */}
            {errors.submit && (
              <p className="admin-order-modal__error">{errors.submit}</p>
            )}
            <div className="admin-order-modal__actions">
              <button
                type="submit"
                className="admin-order-modal__submit-btn"
                disabled={isSubmitting}
                onClick={() => console.log('🔘 Submit button clicked')}
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
