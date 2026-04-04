import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './AdminOrders.less';

interface Order {
  _id: string;
  items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
    extras: { name: string; price: number }[];
    totalPrice: number;
  }[];
  delivery: {
    method: 'delivery' | 'pickup' | 'dine-in';
    fullName?: string;
    street?: string;
    city?: string;
    phone?: string;
    notes?: string;
  };
  payment: {
    method: 'cash' | 'card';
  };
  pricing: {
    total: number;
  };
  printed: boolean;
  createdBy: 'customer' | 'admin';
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reprintingId, setReprintingId] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/orders/recent`);

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
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDeliveryMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      delivery: 'Donáška',
      pickup: 'Vyzdvihnutie',
      'dine-in': 'V reštaurácii',
    };
    return labels[method] || method;
  };

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

        {loading ? (
          <div className="admin-orders__loading">Načítavam objednávky...</div>
        ) : error ? (
          <div className="admin-orders__error">{error}</div>
        ) : orders.length === 0 ? (
          <div className="admin-orders__empty">Žiadne objednávky</div>
        ) : (
          <div className="admin-orders__list">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`admin-orders__item ${
                  order.printed
                    ? 'admin-orders__item--printed'
                    : 'admin-orders__item--not-printed'
                }`}
              >
                <div className="admin-orders__item-header">
                  <div className="admin-orders__item-status">
                    {order.printed ? (
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
                    {order.printed ? 'Vytlačené' : 'Nevytlačené'}
                  </div>
                  <div className="admin-orders__item-date">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="admin-orders__item-info">
                  <div className="admin-orders__item-row">
                    <span className="admin-orders__item-label">Suma:</span>
                    <span className="admin-orders__item-value">
                      {order.pricing.total.toFixed(2)} €
                    </span>
                  </div>
                  <div className="admin-orders__item-row">
                    <span className="admin-orders__item-label">Typ:</span>
                    <span className="admin-orders__item-value">
                      {getDeliveryMethodLabel(order.delivery.method)}
                    </span>
                  </div>
                  <div className="admin-orders__item-row">
                    <span className="admin-orders__item-label">Platba:</span>
                    <span className="admin-orders__item-value">
                      {order.payment.method === 'cash' ? 'Hotovosť' : 'Karta'}
                    </span>
                  </div>
                  {order.delivery.fullName && (
                    <div className="admin-orders__item-row">
                      <span className="admin-orders__item-label">Meno:</span>
                      <span className="admin-orders__item-value">
                        {order.delivery.fullName}
                      </span>
                    </div>
                  )}
                  {order.delivery.phone && (
                    <div className="admin-orders__item-row">
                      <span className="admin-orders__item-label">Telefón:</span>
                      <span className="admin-orders__item-value">
                        {order.delivery.phone}
                      </span>
                    </div>
                  )}
                  {order.delivery.street && order.delivery.city && (
                    <div className="admin-orders__item-row">
                      <span className="admin-orders__item-label">Adresa:</span>
                      <span className="admin-orders__item-value">
                        {order.delivery.street}, {order.delivery.city}
                      </span>
                    </div>
                  )}
                </div>

                <div className="admin-orders__item-products">
                  {order.items.map((item, index) => (
                    <div key={index} className="admin-orders__item-product">
                      <span className="admin-orders__item-product-qty">
                        {item.quantity}×
                      </span>
                      <span className="admin-orders__item-product-name">
                        {item.product.name}
                        {item.extras.length > 0 && (
                          <span className="admin-orders__item-product-extras">
                            {' '}
                            + {item.extras.map((e) => e.name).join(', ')}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {order.delivery.notes && (
                  <div className="admin-orders__item-notes">
                    <strong>Poznámka:</strong> {order.delivery.notes}
                  </div>
                )}

                <div className="admin-orders__item-actions">
                  <button
                    onClick={() => handleReprint(order._id)}
                    disabled={reprintingId === order._id}
                    className="admin-orders__reprint-btn"
                  >
                    {reprintingId === order._id ? (
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
