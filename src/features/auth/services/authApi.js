import { request } from '../../../utils/http';
import { saveToken, removeToken } from '../../../utils/storage';

// Iniciar sesión contra tu API PHP (index.php?url=autenticator&action=ingresarApi)
export async function login(username, password) {
  const data = await request('autenticator&action=ingresarApi', {
    method: 'POST',
    body: { usuario: username, password }
  });

  if (!data.status) {
    throw new Error(data.message || 'No se pudo iniciar sesión');
  }

  // Guardamos el token Bearer recibido del backend
  if (data.token) {
    await saveToken(data.token);
  }

  return data.usuario || data.user;
}

// Restaurar sesión activa si el token sigue siendo válido en el backend
export async function restoreSession() {
  try {
    const data = await request('autenticator&action=sesionApi', { method: 'GET' });
    return data.status ? data.usuario || data.user : null;
  } catch (e) {
    return null;
  }
}

// Cerrar sesión y limpiar el almacenamiento local del token
export async function logout() {
  try {
    await request('autenticator&action=logoutApi', { method: 'POST' });
  } catch (e) {
    // Aunque falle la petición al servidor, nos aseguramos de limpiar localmente
  } finally {
    await removeToken();
  }
}

// Registro de nuevos usuarios
export async function signup(formData) {
  const json = await request('autenticator&action=registroApi', { 
    method: 'POST', 
    body: formData 
  });
  
  if (!json.status) {
    throw new Error(json.message || 'No se pudo crear la cuenta');
  }
  return json;
}

// Recuperación de contraseña
export async function resetPassword(email) {
  const json = await request('autenticator&action=recuperarApi', { 
    method: 'POST', 
    body: { email } 
  });
  
  if (!json.status) {
    throw new Error(json.message || 'No se pudo enviar el correo de recuperación');
  }
  return json;
}