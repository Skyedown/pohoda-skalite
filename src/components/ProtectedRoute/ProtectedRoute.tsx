import React, { useState, useEffect, useCallback } from 'react';
import {
  ADMIN_UNAUTHORIZED_EVENT,
  checkAdminSession,
  type SessionStatus,
} from '../../utils/adminAuth';
import { LoginForm } from './LoginForm';
import './ProtectedRoute.less';

const SESSION_RETRY_MS = 3000;

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
  const [status, setStatus] = useState<SessionStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: number | undefined;
    let attempt = 0;

    const check = async () => {
      attempt += 1;
      const next = await checkAdminSession(attempt);
      if (cancelled) return;
      setStatus(next);
      setHasSession(next === 'authenticated');
      if (next === 'unreachable') {
        retryTimer = window.setTimeout(check, SESSION_RETRY_MS);
      }
    };

    check();
    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
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

  if (status === null) return null;

  if (status === 'unreachable' && !hasSession) {
    return (
      <div className="protected-route">
        <p className="protected-route__connecting" role="status">
          Pripájam sa k serveru…
        </p>
      </div>
    );
  }

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
