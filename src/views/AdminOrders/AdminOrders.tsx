import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AdminOrderCreationModal from '../../components/AdminOrderCreation/AdminOrderCreationModal';
import type { EditOrderData } from '../../components/AdminOrderCreation/AdminOrderCreationModal';
import DateRangeFilter, {
  formatDateParam,
  type DatePreset,
} from '../../components/DateRangeFilter/DateRangeFilter';
import { OrderCard } from '../../components/AdminOrders/OrderCard/OrderCard';
import type { Order } from '../../components/AdminOrders/types';
import './AdminOrders.less';

const ordersPresets: DatePreset[] = ['today', 'yesterday', '7d', '30d'];

const AdminOrders: React.FC = () => {
  const today = formatDateParam(new Date());
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [activePreset, setActivePreset] = useState<string | null>('today');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reprintingId, setReprintingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<EditOrderData | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || '';

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/orders/recent?from=${fromDate}&to=${toDate}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError('Nepodarilo sa načítať objednávky');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, fromDate, toDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleReprint = async (orderId: string) => {
    try {
      setReprintingId(orderId);
      const response = await fetch(`${API_URL}/api/orders/${orderId}/reprint`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reprint order');
      }

      alert('Objednávka bola odoslaná na tlač');
    } catch (err) {
      alert('Nepodarilo sa odoslať objednávku na tlač');
      console.error('Error reprinting order:', err);
    } finally {
      setReprintingId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Naozaj chcete odstrániť túto objednávku?')) {
      return;
    }

    try {
      setDeletingId(orderId);
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Remove order from the list
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      alert('Objednávka bola odstránená');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Neznáma chyba';
      alert(`Nepodarilo sa odstrániť objednávku: ${errorMsg}`);
      console.error('Error deleting order:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = useCallback((order: Order) => {
    setEditingOrder(order as unknown as EditOrderData);
  }, []);

  return (
    <div className="admin-orders">
      <Helmet>
        <title>Predošlé objednávky | Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-orders__container">
        <div className="admin-orders__header">
          <h1 className="admin-orders__title">Predošlé objednávky</h1>
          <div className="admin-orders__header-actions">
            <Link to="/admin" className="admin-orders__nav-link">
              ← Hlavná stránka
            </Link>
          </div>
        </div>

        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          activePreset={activePreset}
          presets={ordersPresets}
          onFromChange={(v) => {
            setActivePreset(null);
            setFromDate(v);
          }}
          onToChange={(v) => {
            setActivePreset(null);
            setToDate(v);
          }}
          onPresetChange={(preset, from, to) => {
            setActivePreset(preset);
            setFromDate(from);
            setToDate(to);
          }}
          idPrefix="orders"
        />

        {loading ? (
          <div className="admin-orders__loading">Načítavam objednávky...</div>
        ) : error ? (
          <div className="admin-orders__error">{error}</div>
        ) : orders.length === 0 ? (
          <div className="admin-orders__empty">Žiadne objednávky</div>
        ) : (
          <div className="admin-orders__list">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                reprintingId={reprintingId}
                deletingId={deletingId}
                onEdit={handleEdit}
                onReprint={handleReprint}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AdminOrderCreationModal
        isOpen={editingOrder !== null}
        onClose={() => setEditingOrder(null)}
        editOrder={editingOrder}
        onSaved={fetchOrders}
      />
    </div>
  );
};

export default AdminOrders;
