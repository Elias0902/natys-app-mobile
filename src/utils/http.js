import { BASE_URL } from './config';
import { getToken, removeToken } from './storage';

// Callback global para manejar cuando la sesión expire (401)
let sessionExpiredHandler = null;

export const setSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = handler;
};

export async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}/index.php?url=${endpoint}`;

  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // Si el backend responde con 401 (Token vencido o inválido)
    if (response.status === 401) {
      await removeToken();
      if (sessionExpiredHandler) {
        sessionExpiredHandler(); // Dispara la notificación y el cierre de sesión en el navegador/app
      }
      throw new Error('Tu sesión ha expirado.');
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Error en la petición [${endpoint}]:`, error);
    throw error;
  }
}