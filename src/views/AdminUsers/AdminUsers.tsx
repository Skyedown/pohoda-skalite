import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchCurrentAdmin } from '../../utils/adminAuth';
import { AdminUserList } from '../../components/AdminPanel/AdminUserList/AdminUserList';
import { AdminUserCreateForm } from '../../components/AdminPanel/AdminUserCreateForm/AdminUserCreateForm';
import { AdminPasswordForm } from '../../components/AdminPanel/AdminPasswordForm/AdminPasswordForm';
import { listUsers, type AdminUserRow } from './adminUsers.helpers';
import '../AdminPanel/AdminPanel.less';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [currentUsername, setCurrentUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setError('');
    try {
      setUsers(await listUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neznáma chyba');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentAdmin().then((user) =>
      setCurrentUsername(user?.username ?? ''),
    );
    refresh();
  }, [refresh]);

  return (
    <div className="admin-panel">
      <Helmet>
        <title>Používatelia | Admin Panel | Pohoda Skalité</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-panel__container">
        <div className="admin-panel__header">
          <h1 className="admin-panel__title">Používatelia</h1>
          <Link to="/admin" className="admin-panel__logout">
            ← Hlavná stránka
          </Link>
        </div>

        <div className="admin-panel__content">
          {error && <p className="admin-panel__error">{error}</p>}

          {loading ? (
            <p>Načítavam používateľov…</p>
          ) : (
            <AdminUserList
              users={users}
              currentUsername={currentUsername}
              onChanged={refresh}
            />
          )}

          <AdminUserCreateForm onCreated={refresh} />

          <AdminPasswordForm />

          <div className="admin-panel__footer">
            <Link to="/" className="admin-panel__back-link">
              ← Späť na hlavnú stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
