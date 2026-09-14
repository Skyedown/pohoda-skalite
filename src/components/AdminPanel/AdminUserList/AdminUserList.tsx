import React, { useCallback, useState } from 'react';
import {
  deleteUser,
  formatCreatedAt,
  type AdminUserRow,
} from '../../../views/AdminUsers/adminUsers.helpers';
import './AdminUserList.less';

interface AdminUserListProps {
  users: AdminUserRow[];
  currentUsername: string;
  onChanged: () => void;
}

export const AdminUserList: React.FC<AdminUserListProps> = ({
  users,
  currentUsername,
  onChanged,
}) => {
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (user: AdminUserRow) => {
      if (!confirm(`Naozaj zmazať používateľa "${user.username}"?`)) return;

      setError('');
      setDeletingId(user.id);
      try {
        await deleteUser(user.id);
        onChanged();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Neznáma chyba');
      } finally {
        setDeletingId(null);
      }
    },
    [onChanged],
  );

  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">Existujúci používatelia</h2>
      <p className="admin-panel__section-description">
        Každý používateľ má plný prístup do administrácie. Posledný účet sa
        zmazať nedá, inak by sa do admina už nikto nedostal.
      </p>

      {error && <p className="admin-user-list__error">{error}</p>}

      <ul className="admin-user-list">
        {users.map((user) => {
          const isCurrent = user.username === currentUsername;
          return (
            <li className="admin-user-list__item" key={user.id}>
              <div className="admin-user-list__info">
                <span className="admin-user-list__name">
                  {user.username}
                  {isCurrent && (
                    <span className="admin-user-list__badge">vy</span>
                  )}
                </span>
                <span className="admin-user-list__date">
                  vytvorený {formatCreatedAt(user.createdAt)}
                </span>
              </div>
              <button
                type="button"
                className="admin-user-list__delete"
                onClick={() => handleDelete(user)}
                disabled={isCurrent || deletingId === user.id}
                title={isCurrent ? 'Nemôžete zmazať sám seba' : 'Zmazať'}
              >
                {deletingId === user.id ? 'Mažem…' : 'Zmazať'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
