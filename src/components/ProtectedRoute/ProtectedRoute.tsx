import React, { useState, useEffect, useCallback } from 'react';
import {
  ADMIN_UNAUTHORIZED_EVENT,
  fetchCurrentAdmin,
} from '../../utils/adminAuth';
import { LoginForm } from './LoginForm';
import './ProtectedRoute.less';

/**
 * The session is an httpOnly cookie issued by the API, so this component only
 * asks the server whether the visitor is signed in. When a request later comes
 * back 401, the admin stays mounted under a login overlay so a half-filled
 * order survives re-authentication.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasSession, setHasSession] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentAdmin().then((user) => {
      if (cancelled) return;
      setHasSession(!!user);
      setIsChecked(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => setIsExpired(true);

    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const handleLogin = useCallback(() => {
    setHasSession(true);
    setIsExpired(false);
  }, []);

  if (!isChecked) return null;

  if (!hasSession) {
    return (
      <div className="protected-route">
        <div className="protected-route__login">
          <LoginForm
            title="Prihlásenie do administrácie"
            onSuccess={handleLogin}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {isExpired && (
        <div className="protected-route__overlay" role="dialog" aria-modal>
          <LoginForm
            title="Prihlásenie vypršalo"
            initialError="Prihláste sa znova — rozpracované údaje zostanú zachované."
            onSuccess={handleLogin}
          />
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
