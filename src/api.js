import { BASE_URL, USE_MOCK } from './config';
import { MOCK, MOCK_USER, MOCK_CLIENT } from './mock';

// Login against the mobile JSON endpoint (see php/login_movil.php).
// The PHP session cookie is stored automatically by React Native.
export async function login(username, password) {
  if (USE_MOCK) {
    if (!username || !password) throw new Error('Todos los campos son obligatorios.');
    return username.toLowerCase() === 'cliente' ? MOCK_CLIENT : MOCK_USER;
  }
  const res = await fetch(`${BASE_URL}/api/login_movil.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!data.status) throw new Error(data.message || 'No se pudo iniciar sesión');
  return data.user;
}

// Generic list call (see php/lista_movil.php): api/lista_movil.php?modulo=<module>
export async function getList(modulo) {
  if (USE_MOCK) return MOCK[modulo] || [];
  const res = await fetch(`${BASE_URL}/api/lista_movil.php?modulo=${modulo}`, {
    credentials: 'include',
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Respuesta no válida del servidor');
  }
  if (!data.status) throw new Error(data.message || 'Error al consultar');
  return data.data;
}

// Sign up (TODO backend: create api/registro_movil.php; the web flow is AutenticatorController?action=registrar)
export async function signup(data) {
  if (USE_MOCK) return { message: 'Cuenta creada. Revisa tu correo para activarla.' };
  const res = await fetch(`${BASE_URL}/api/registro_movil.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.status) throw new Error(json.message || 'No se pudo crear la cuenta');
  return json;
}

// Reset password (TODO backend: create api/recuperar_movil.php; the web flow is AutenticatorController?action=recuperar)
export async function resetPassword(email) {
  if (USE_MOCK) return { message: 'Te enviamos un enlace para restablecer tu contraseña.' };
  const res = await fetch(`${BASE_URL}/api/recuperar_movil.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const json = await res.json();
  if (!json.status) throw new Error(json.message || 'No se pudo enviar el correo');
  return json;
}
