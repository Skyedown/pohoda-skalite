import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ProtectedRoute.less';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    setIsAuthenticated(authenticated === 'true');
    setIsChecked(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsername = import.meta.env.VITE_ADMIN_NAME || 'admin';
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Nesprávne prihlasovacie údaje');
    }
  };

  if (!isChecked) return null;

  // After login, always redirect to /admin
  if (
    isAuthenticated &&
    location.pathname !== '/admin' &&
    !sessionStorage.getItem('admin_navigated')
  ) {
    sessionStorage.setItem('admin_navigated', 'true');
  }

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
            {passwordError && (
              <p className="protected-route__error">{passwordError}</p>
            )}
            <button type="submit" className="protected-route__submit">
              Prihlásiť sa
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
