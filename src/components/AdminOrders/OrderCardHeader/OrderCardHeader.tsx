import React from 'react';
import { formatOrderDate } from '../adminOrdersHelpers';
import './OrderCardHeader.less';

interface OrderCardHeaderProps {
  printNumber?: number;
  printed: boolean;
  createdAt: string;
}

export const OrderCardHeader: React.FC<OrderCardHeaderProps> = ({
  printNumber,
  printed,
  createdAt,
}) => {
  return (
    <div className="admin-orders__item-header">
      {printNumber && (
        <div className="admin-orders__item-number">#{printNumber}</div>
      )}
      <div className="admin-orders__item-status">
        {printed ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
        {printed ? 'Vytlačené' : 'Nevytlačené'}
      </div>
      <div className="admin-orders__item-date">
        {formatOrderDate(createdAt)}
      </div>
    </div>
  );
};
