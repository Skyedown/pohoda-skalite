import React, { useCallback, useState } from 'react';
import { loginAdmin } from '../../utils/adminAuth';

interface LoginFormProps {
  title: string;
  initialError?: string;
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  title,
  initialError = '',
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
    [],
  );
  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError('');

      const result = await loginAdmin(username, password);

      setIsSubmitting(false);
      if ('user' in result) {
        setPassword('');
        onSuccess();
      } else {
        setError(result.error);
      }
    },
    [username, password, onSuccess],
  );

  return (
    <div className="protected-route__login-box">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit} className="protected-route__login-form">
        <div className="protected-route__field">
          <label htmlFor="admin-username">Meno:</label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            autoComplete="username"
          />
        </div>
        <div className="protected-route__field">
          <label htmlFor="admin-password">Heslo:</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="protected-route__error">{error}</p>}
        <button
          type="submit"
          className="protected-route__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Prihlasujem…' : 'Prihlásiť sa'}
        </button>
      </form>
    </div>
  );
};
