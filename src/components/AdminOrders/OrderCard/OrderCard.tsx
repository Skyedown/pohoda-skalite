import React, { useCallback } from 'react';
import type { Order } from '../types';
import './OrderCard.less';
import { OrderCardHeader } from '../OrderCardHeader/OrderCardHeader';
import { OrderCardInfo } from '../OrderCardInfo/OrderCardInfo';
import { OrderCardProducts } from '../OrderCardProducts/OrderCardProducts';
import { OrderCardActions } from '../OrderCardActions/OrderCardActions';

interface OrderCardProps {
  order: Order;
  reprintingId: string | null;
  deletingId: string | null;
  onEdit: (order: Order) => void;
  onReprint: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  reprintingId,
  deletingId,
  onEdit,
  onReprint,
  onDelete,
}) => {
  const handleEdit = useCallback(() => onEdit(order), [onEdit, order]);
  const handleReprint = useCallback(
    () => onReprint(order._id),
    [onReprint, order._id],
  );
  const handleDelete = useCallback(
    () => onDelete(order._id),
    [onDelete, order._id],
  );

  return (
    <div
      className={`admin-orders__item ${
        order.printed
          ? 'admin-orders__item--printed'
          : 'admin-orders__item--not-printed'
      }`}
    >
      <OrderCardHeader
        printNumber={order.printNumber}
        printed={order.printed}
        createdAt={order.createdAt}
      />
      <OrderCardInfo
        delivery={order.delivery}
        payment={order.payment}
        total={order.pricing.total}
      />
      <OrderCardProducts items={order.items} />
      {order.delivery.notes && (
        <div className="admin-orders__item-notes">
          <strong>Poznámka:</strong> {order.delivery.notes}
        </div>
      )}
      <OrderCardActions
        orderId={order._id}
        reprintingId={reprintingId}
        deletingId={deletingId}
        onEdit={handleEdit}
        onReprint={handleReprint}
        onDelete={handleDelete}
      />
    </div>
  );
};
