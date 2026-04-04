import React from 'react';
import OrderItemRow from '../OrderItemRow/OrderItemRow';
import OrderSummary from '../../Cart/OrderSummary/OrderSummary';
import type { Extra } from '../../../types';
import type { AdminOrderItem } from '../adminHelpers';
import './OrderItemsList.less';

interface OrderItemsListProps {
  orderItems: AdminOrderItem[];
  editingItemIndex: number | null;
  defaultExtras: Extra[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onQuantityChange: (itemIndex: number, quantity: number) => void;
  onEditExtras: (itemIndex: number) => void;
  onToggleExtra: (extraId: string) => void;
  onCloseExtras: () => void;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  orderItems,
  editingItemIndex,
  defaultExtras,
  subtotal,
  deliveryFee,
  total,
  onQuantityChange,
  onEditExtras,
  onToggleExtra,
  onCloseExtras,
}) => {
  return (
    <div className="order-items-list">
      {orderItems.map((item, itemIndex) => (
        <OrderItemRow
          key={`${item.product.id}-${itemIndex}`}
          item={item}
          itemIndex={itemIndex}
          isEditing={editingItemIndex === itemIndex}
          defaultExtras={defaultExtras}
          onQuantityChange={onQuantityChange}
          onEditExtras={onEditExtras}
          onToggleExtra={onToggleExtra}
          onCloseExtras={onCloseExtras}
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
