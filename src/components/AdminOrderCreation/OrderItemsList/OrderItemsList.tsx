import React from 'react';
import OrderItemRow from '../OrderItemRow/OrderItemRow';
import OrderSummary from '../../PizzaCart/OrderSummary/OrderSummary';
import type { AdminOrderItem } from '../adminHelpers';
import { getExtrasForProductType } from '../adminHelpers';
import './OrderItemsList.less';

interface OrderItemsListProps {
  orderItems: AdminOrderItem[];
  editingItemIndex: number | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  onQuantityChange: (itemIndex: number, quantity: number) => void;
  onEditExtras: (itemIndex: number) => void;
  onToggleExtra: (extraId: string) => void;
  onCloseExtras: () => void;
  onEditIngredients?: (itemIndex: number) => void;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  orderItems,
  editingItemIndex,
  subtotal,
  deliveryFee,
  total,
  onQuantityChange,
  onEditExtras,
  onToggleExtra,
  onCloseExtras,
  onEditIngredients,
}) => {
  return (
    <div className="order-items-list">
      {orderItems.map((item, itemIndex) => (
        <OrderItemRow
          key={`${item.product.id}-${itemIndex}`}
          item={item}
          itemIndex={itemIndex}
          isEditing={editingItemIndex === itemIndex}
          availableExtras={getExtrasForProductType(item.product.type)}
          onQuantityChange={onQuantityChange}
          onEditExtras={onEditExtras}
          onToggleExtra={onToggleExtra}
          onCloseExtras={onCloseExtras}
          onEditIngredients={onEditIngredients}
        />
      ))}

      {/* Order Summary */}
      <div className="order-items-list__summary">
        <OrderSummary
          subtotal={subtotal}
          delivery={deliveryFee}
          total={total}
        />
      </div>
    </div>
  );
};

export default OrderItemsList;
