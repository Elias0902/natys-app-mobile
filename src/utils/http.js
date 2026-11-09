import { BASE_URL } from './config';

let onSessionExpired = () => {};

// AppNavigator registers here what to do when the server says the session is over.
export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

// Calls natys-larence/api/<path>. The PHP session cookie travels with every request.
export async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}/api/${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    onSessionExpired();
    throw new Error('Tu sesión venció. Inicia sesión de nuevo.');
  }
  try {
    return await res.json();
  } catch {
    // PHP errors can come back as HTML
    throw new Error('Respuesta no válida del servidor');
  }
}
