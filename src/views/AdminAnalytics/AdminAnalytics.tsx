import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import OrderStats from '../../components/AdminAnalytics/OrderStats';
import './AdminAnalytics.less';

const AdminAnalytics: React.FC = () => {
  return (
    <div className="admin-analytics">
      <Helmet>
        <title>Analytika | Admin Panel | Pohoda Skalite</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-analytics__container">
        <div className="admin-analytics__header">
          <h1 className="admin-analytics__title">Štatistiky objednávok</h1>
          <div className="admin-analytics__header-actions">
            <Link to="/admin" className="admin-analytics__nav-link">
              ← Hlavná stránka
            </Link>
          </div>
        </div>

        <div className="admin-analytics__content">
          <OrderStats />
        </div>

        <div className="admin-analytics__footer">
          <Link to="/" className="admin-analytics__back-link">
            ← Späť na hlavnú stránku
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
