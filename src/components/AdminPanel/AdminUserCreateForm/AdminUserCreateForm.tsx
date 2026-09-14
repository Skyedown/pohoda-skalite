import React, { useCallback, useState } from 'react';
import { createUser } from '../../../views/AdminUsers/adminUsers.helpers';
import '../AdminUserList/AdminUserList.less';

interface AdminUserCreateFormProps {
  onCreated: () => void;
}

export const AdminUserCreateForm: React.FC<AdminUserCreateFormProps> = ({
  onCreated,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setIsSubmitting(true);

      try {
        await createUser(username, password);
        setSuccess(`Používateľ "${username.toLowerCase()}" bol vytvorený.`);
        setUsername('');
        setPassword('');
        onCreated();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Neznáma chyba');
      } finally {
        setIsSubmitting(false);
      }
    },
    [username, password, onCreated],
  );

  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">Pridať používateľa</h2>
      <p className="admin-panel__section-description">
        Meno sa ukladá malými písmenami, takže pri prihlasovaní na veľkosti
        nezáleží. Heslo musí mať aspoň 8 znakov.
      </p>

      <form className="admin-user-form" onSubmit={handleSubmit}>
        <div className="admin-user-form__field">
          <label htmlFor="new-username">Meno</label>
          <input
            id="new-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div className="admin-user-form__field">
          <label htmlFor="new-password">Heslo</label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        {error && <p className="admin-user-form__error">{error}</p>}
        {success && <p className="admin-user-form__success">{success}</p>}

        <button
          type="submit"
          className="admin-user-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Vytváram…' : 'Vytvoriť používateľa'}
        </button>
      </form>
    </div>
  );
};
