import React, { useEffect, useRef } from 'react';
import type { Extra } from '../../../types';
import AdminExtrasSelector from '../AdminExtrasSelector';
import type { AdminOrderItem } from '../adminHelpers';
import './OrderItemRow.less';

interface OrderItemRowProps {
  item: AdminOrderItem;
  itemIndex: number;
  isEditing: boolean;
  defaultExtras: Extra[];
  onQuantityChange: (itemIndex: number, quantity: number) => void;
  onEditExtras: (itemIndex: number) => void;
  onToggleExtra: (extraId: string) => void;
  onCloseExtras: () => void;
}

const OrderItemRow: React.FC<OrderItemRowProps> = ({
  item,
  itemIndex,
  isEditing,
  defaultExtras,
  onQuantityChange,
  onEditExtras,
  onToggleExtra,
  onCloseExtras,
}) => {
  const extrasPrice = item.extras.reduce((sum, extra) => sum + extra.price, 0);
  const itemTotal = (item.product.price + extrasPrice) * item.quantity;
  const extrasPanelRef = useRef<HTMLDivElement>(null);
  const extrasBtnRef = useRef<HTMLButtonElement>(null);

  // Close extras panel when clicking outside
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        extrasPanelRef.current &&
        !extrasPanelRef.current.contains(event.target as Node) &&
        extrasBtnRef.current &&
        !extrasBtnRef.current.contains(event.target as Node)
      ) {
        onCloseExtras();
      }
    };

    // Add event listener with a slight delay to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, onCloseExtras]);

  return (
    <div
      className={`order-item-row ${isEditing ? 'order-item-row--editing' : ''}`}
    >
      {/* Left: Quantity Badge + Product Info */}
      <div className="order-item-row__left">
        <div className="order-item-row__quantity-badge">{item.quantity}×</div>
        <div className="order-item-row__details">
          <p className="order-item-row__name">{item.product.name}</p>
          <p className="order-item-row__unit-price">
            {item.product.price.toFixed(2)} € / ks
          </p>
          {item.extras.length > 0 && (
            <p className="order-item-row__extras">
              <span className="order-item-row__extras-label">Extras:</span>{' '}
              {item.extras.map((e) => e.name).join(', ')} (+
              {extrasPrice.toFixed(2)} €)
            </p>
          )}
        </div>
      </div>

      {/* Center: Quantity Controls + Prílohy Button */}
      <div className="order-item-row__center">
        <button
          ref={extrasBtnRef}
          type="button"
          className="order-item-row__extras-btn"
          onClick={() => onEditExtras(itemIndex)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Prílohy
        </button>
        <div className="order-item-row__quantity-controls">
          <button
            type="button"
            className="order-item-row__quantity-btn order-item-row__quantity-btn--minus"
            onClick={() => onQuantityChange(itemIndex, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="order-item-row__quantity-display">
            {item.quantity}
          </span>
          <button
            type="button"
            className="order-item-row__quantity-btn order-item-row__quantity-btn--plus"
            onClick={() => onQuantityChange(itemIndex, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Right: Total + Remove */}
      <div className="order-item-row__right">
        <div className="order-item-row__total">{itemTotal.toFixed(2)} €</div>
        <button
          type="button"
          className="order-item-row__remove-btn"
          onClick={() => onQuantityChange(itemIndex, 0)}
          title="Odstrániť"
          aria-label="Odstrániť položku"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Extras Selector Panel */}
      {isEditing && (
        <div className="order-item-row__extras-panel" ref={extrasPanelRef}>
          <AdminExtrasSelector
            extras={defaultExtras}
            selectedExtras={item.extras.map((e) => e.id)}
            onToggleExtra={onToggleExtra}
          />
        </div>
      )}
    </div>
  );
};

export default OrderItemRow;
