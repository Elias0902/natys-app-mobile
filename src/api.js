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

// ---- CRUD of the modules (see php/crud_movil.php) ----
// In mock mode the changes are kept in memory until the page is reloaded.
async function crud(modulo, accion, payload) {
  const res = await fetch(`${BASE_URL}/api/crud_movil.php?modulo=${modulo}&accion=${accion}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error('Respuesta no válida del servidor');
  }
  if (!json.status) throw new Error(json.message || 'No se pudo completar la operación');
  return json;
}

const nextId = (rows, idKey) => rows.reduce((max, r) => Math.max(max, Number(r[idKey]) || 0), 0) + 1;

export async function createRecord(modulo, idKey, data) {
  if (USE_MOCK) {
    const rows = MOCK[modulo] || [];
    const id = data[idKey] !== undefined && data[idKey] !== '' ? data[idKey] : nextId(rows, idKey);
    if (rows.some((r) => String(r[idKey]) === String(id))) throw new Error('Ya existe un registro con ese código.');
    const record = { [idKey]: id, ...data, [idKey]: id };
    MOCK[modulo] = [record, ...rows];
    return record;
  }
  return (await crud(modulo, 'registrar', data)).data;
}

export async function updateRecord(modulo, idKey, id, data) {
  if (USE_MOCK) {
    MOCK[modulo] = (MOCK[modulo] || []).map((r) => (String(r[idKey]) === String(id) ? { ...r, ...data, [idKey]: r[idKey] } : r));
    return;
  }
  await crud(modulo, 'modificar', { ...data, [idKey]: id });
}

export async function deleteRecord(modulo, idKey, id) {
  if (USE_MOCK) {
    MOCK[modulo] = (MOCK[modulo] || []).filter((r) => String(r[idKey]) !== String(id));
    return;
  }
  await crud(modulo, 'eliminar', { [idKey]: id });
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
