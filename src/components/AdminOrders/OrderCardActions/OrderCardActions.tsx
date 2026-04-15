import React from 'react';
import './OrderCardActions.less';

interface OrderCardActionsProps {
  orderId: string;
  reprintingId: string | null;
  deletingId: string | null;
  onEdit: () => void;
  onReprint: () => void;
  onDelete: () => void;
}

export const OrderCardActions: React.FC<OrderCardActionsProps> = ({
  orderId,
  reprintingId,
  deletingId,
  onEdit,
  onReprint,
  onDelete,
}) => {
  const isDisabled = reprintingId === orderId || deletingId === orderId;

  return (
    <div className="admin-orders__item-actions">
      <button onClick={onEdit} className="admin-orders__edit-btn">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Upraviť
      </button>
      <button
        onClick={onReprint}
        disabled={isDisabled}
        className="admin-orders__reprint-btn"
      >
        {reprintingId === orderId ? (
          'Odosielam...'
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Tlačiť znovu
          </>
        )}
      </button>
      <button
        onClick={onDelete}
        disabled={isDisabled}
        className="admin-orders__delete-btn"
      >
        {deletingId === orderId ? (
          'Odstraňujem...'
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Odstrániť
          </>
        )}
      </button>
    </div>
  );
};
