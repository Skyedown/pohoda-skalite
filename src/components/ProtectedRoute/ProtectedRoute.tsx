import React, { useState, useEffect, useCallback } from 'react';
import {
  ADMIN_UNAUTHORIZED_EVENT,
  fetchCurrentAdmin,
  loginAdmin,
} from '../../utils/adminAuth';
import './ProtectedRoute.less';

/**
 * The session is an httpOnly cookie issued by the API, so this component only
 * asks the server whether the visitor is signed in — it never sees or compares
 * credentials itself. Any admin request that comes back 401 fires
 * ADMIN_UNAUTHORIZED_EVENT and drops straight back to this form.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentAdmin().then((user) => {
      if (cancelled) return;
      setIsAuthenticated(!!user);
      setIsChecked(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setError('Vaše prihlásenie vypršalo. Prihláste sa znova.');
    };

    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError('');

      const result = await loginAdmin(username, password);

      if ('user' in result) {
        setPassword('');
        setIsAuthenticated(true);
      } else {
        setError(result.error);
      }

      setIsSubmitting(false);
    },
    [username, password],
  );

  if (!isChecked) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="protected-route">
      <div className="protected-route__login">
        <div className="protected-route__login-box">
          <h2>Prihlásenie do administrácie</h2>
          <form onSubmit={handleLogin} className="protected-route__login-form">
            <div className="protected-route__field">
              <label htmlFor="admin-username">Meno:</label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="protected-route__field">
              <label htmlFor="admin-password">Heslo:</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
      </div>
    </div>
  );
};

export default ProtectedRoute;
