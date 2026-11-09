import { USE_MOCK } from '../../../utils/config';
import { MOCK_USER, MOCK_CLIENT } from '../../../utils/mock';
import { request } from '../../../utils/http';

// See php/login_movil.php
export async function login(username, password) {
  if (USE_MOCK) {
    if (!username || !password) throw new Error('Todos los campos son obligatorios.');
    return username.toLowerCase() === 'cliente' ? MOCK_CLIENT : MOCK_USER;
  }
  const data = await request('login_movil.php', { method: 'POST', body: { username, password } });
  if (!data.status) throw new Error(data.message || 'No se pudo iniciar sesión');
  return data.user;
}

// Returns the logged-in user if the server session is still alive (see php/sesion_movil.php).
export async function restoreSession() {
  if (USE_MOCK) return null;
  const data = await request('sesion_movil.php');
  return data.status ? data.user : null;
}

// See php/logout_movil.php
export async function logout() {
  if (USE_MOCK) return;
  await request('logout_movil.php', { method: 'POST' });
}

// See php/registro_movil.php
export async function signup(data) {
  if (USE_MOCK) return { message: 'Cuenta creada. Revisa tu correo para activarla.' };
  const json = await request('registro_movil.php', { method: 'POST', body: data });
  if (!json.status) throw new Error(json.message || 'No se pudo crear la cuenta');
  return json;
}

// See php/recuperar_movil.php
export async function resetPassword(email) {
  if (USE_MOCK) return { message: 'Te enviamos un enlace para restablecer tu contraseña.' };
  const json = await request('recuperar_movil.php', { method: 'POST', body: { email } });
  if (!json.status) throw new Error(json.message || 'No se pudo enviar el correo');
  return json;
}
