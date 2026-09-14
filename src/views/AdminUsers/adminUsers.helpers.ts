import { adminFetch } from '../../utils/adminAuth';

export interface AdminUserRow {
  id: string;
  username: string;
  createdAt: string;
}

async function readError(response: Response, fallback: string) {
  const data = await response.json().catch(() => ({}));
  return data.error || fallback;
}

export async function listUsers(): Promise<AdminUserRow[]> {
  const response = await adminFetch('/api/auth/users');
  if (!response.ok) {
    throw new Error(
      await readError(response, 'Nepodarilo sa načítať používateľov'),
    );
  }
  const data = await response.json();
  return data.users ?? [];
}

export async function createUser(
  username: string,
  password: string,
): Promise<void> {
  const response = await adminFetch('/api/auth/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error(
      await readError(response, 'Nepodarilo sa vytvoriť používateľa'),
    );
  }
}

export async function deleteUser(id: string): Promise<void> {
  const response = await adminFetch(`/api/auth/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(
      await readError(response, 'Nepodarilo sa zmazať používateľa'),
    );
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const response = await adminFetch('/api/auth/password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!response.ok) {
    throw new Error(await readError(response, 'Nepodarilo sa zmeniť heslo'));
  }
}

export function formatCreatedAt(value: string): string {
  return new Date(value).toLocaleDateString('sk-SK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
