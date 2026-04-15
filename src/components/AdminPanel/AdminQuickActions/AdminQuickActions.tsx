import React from 'react';
import { Link } from 'react-router-dom';
import './AdminQuickActions.less';

interface AdminQuickActionsProps {
  onNewOrder: () => void;
}

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({
  onNewOrder,
}) => {
  return (
    <div className="admin-panel__quick-actions">
      <button
        onClick={onNewOrder}
        className="admin-panel__action-btn admin-panel__action-btn--order"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nová objednávka
      </button>
      <Link
        to="/admin/orders"
        className="admin-panel__action-btn admin-panel__action-btn--orders"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        Predošlé objednávky
      </Link>
      <Link
        to="/admin/analytics"
        className="admin-panel__action-btn admin-panel__action-btn--analytics"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        Štatistiky
      </Link>
    </div>
  );
};
