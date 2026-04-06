import React from 'react';
import EmptyCart from '../EmptyCart/EmptyCart';
import OrderItemsList from '../OrderItemsList/OrderItemsList';
import type { AdminOrderItem } from '../adminHelpers';
import './OrderSidebar.less';

interface OrderSidebarProps {
  orderItems: AdminOrderItem[];
  editingItemIndex: number | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isSubmitting: boolean;
  submitError?: string;
  onQuantityChange: (itemIndex: number, quantity: number) => void;
  onEditExtras: (itemIndex: number) => void;
  onToggleExtra: (extraId: string) => void;
  onCloseExtras: () => void;
  onEditIngredients?: (itemIndex: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const OrderSidebar: React.FC<OrderSidebarProps> = ({
  orderItems,
  editingItemIndex,
  subtotal,
  deliveryFee,
  total,
  isSubmitting,
  submitError,
  onQuantityChange,
  onEditExtras,
  onToggleExtra,
  onCloseExtras,
  onEditIngredients,
  onSubmit,
}) => {
  return (
    <div className="order-sidebar">
      <h3 className="order-sidebar__title">Objednávka ({orderItems.length})</h3>

      {orderItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <OrderItemsList
            orderItems={orderItems}
            editingItemIndex={editingItemIndex}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            onQuantityChange={onQuantityChange}
            onEditExtras={onEditExtras}
            onToggleExtra={onToggleExtra}
            onCloseExtras={onCloseExtras}
            onEditIngredients={onEditIngredients}
          />

          {/* Submit Button */}
          {submitError && <p className="order-sidebar__error">{submitError}</p>}
          <div className="order-sidebar__actions">
            <button
              type="submit"
              onClick={onSubmit}
              className="order-sidebar__submit-btn"
              disabled={isSubmitting || orderItems.length === 0}
            >
              {isSubmitting ? 'Ukladám…' : 'Vytvoriť objednávku'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSidebar;
