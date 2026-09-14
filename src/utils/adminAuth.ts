import { config } from '../config';

/**
 * The admin session lives in an httpOnly cookie issued by the API, so the
 * browser never sees the token and the credentials are never shipped to the
 * client. Every admin request goes through `adminFetch` so a session that
 * expires mid-session drops the user back to the login form instead of
 * silently failing.
 */

export const ADMIN_UNAUTHORIZED_EVENT = 'adminUnauthorized';

export interface AdminUser {
  username: string;
}

export async function adminFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    credentials: 'include',
  });

  if (response.status === 401) {
    window.dispatchEvent(new Event(ADMIN_UNAUTHORIZED_EVENT));
  }

  return response;
}

export async function fetchCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const response = await fetch(`${config.apiUrl}/api/auth/me`, {
      credentials: 'include',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<{ user: AdminUser } | { error: string }> {
  try {
    const response = await fetch(`${config.apiUrl}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return { user: data.user };
    }

    if (response.status === 503) {
      return { error: 'Databáza je nedostupná. Skúste to o chvíľu.' };
    }

    return { error: 'Nesprávne prihlasovacie údaje' };
  } catch {
    return { error: 'Server je nedostupný. Skúste to o chvíľu.' };
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch(`${config.apiUrl}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Clearing the cookie server-side failed; the redirect below still applies.
  }
}
