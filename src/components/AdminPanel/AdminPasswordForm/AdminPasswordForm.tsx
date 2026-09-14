import React, { useCallback, useState } from 'react';
import { changePassword } from '../../../views/AdminUsers/adminUsers.helpers';
import '../AdminUserList/AdminUserList.less';

export const AdminPasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      if (newPassword !== repeatPassword) {
        setError('Nové heslá sa nezhodujú');
        return;
      }

      setIsSubmitting(true);
      try {
        await changePassword(currentPassword, newPassword);
        setSuccess('Heslo bolo zmenené.');
        setCurrentPassword('');
        setNewPassword('');
        setRepeatPassword('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Neznáma chyba');
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentPassword, newPassword, repeatPassword],
  );

  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">Zmena môjho hesla</h2>

      <form className="admin-user-form" onSubmit={handleSubmit}>
        <div className="admin-user-form__field">
          <label htmlFor="current-password">Súčasné heslo</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="admin-user-form__field">
          <label htmlFor="new-password-1">Nové heslo</label>
          <input
            id="new-password-1"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <div className="admin-user-form__field">
          <label htmlFor="new-password-2">Nové heslo znova</label>
          <input
            id="new-password-2"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
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
          {isSubmitting ? 'Ukladám…' : 'Zmeniť heslo'}
        </button>
      </form>
    </div>
  );
};
