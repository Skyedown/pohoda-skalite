import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AdminOrderCreationModal from '../../components/AdminOrderCreation/AdminOrderCreationModal';
import { AdminQuickActions } from '../../components/AdminPanel/AdminQuickActions/AdminQuickActions';
import './AdminPanel.less';

const AdminPanel: React.FC = () => {
  const [isOrderCreationModalOpen, setIsOrderCreationModalOpen] =
    useState(false);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/admin';
  }, []);

  const handleOpenNewOrder = useCallback(
    () => setIsOrderCreationModalOpen(true),
    [],
  );

  return (
    <div className="admin-panel">
      <Helmet>
        <title>Admin Panel | Pohoda Skalite</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-panel__container">
        <div className="admin-panel__header">
          <h1 className="admin-panel__title">Admin Panel</h1>
          <button onClick={handleLogout} className="admin-panel__logout">
            Odhlásiť sa
          </button>
        </div>

        <div className="admin-panel__content">
          <AdminQuickActions onNewOrder={handleOpenNewOrder} />

          <div className="admin-panel__footer">
            <Link to="/" className="admin-panel__back-link">
              ← Späť na hlavnú stránku
            </Link>
          </div>
        </div>
      </div>

      <AdminOrderCreationModal
        isOpen={isOrderCreationModalOpen}
        onClose={() => setIsOrderCreationModalOpen(false)}
      />
    </div>
  );
};

export default AdminPanel;
