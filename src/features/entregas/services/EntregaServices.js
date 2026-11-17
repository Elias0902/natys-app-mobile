import { request } from '../../../utils/http';

export async function getEntregas() {
  const response = await request('entregas&action=consultarEntregas', { method: 'GET' });
    
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar las entreas');
  }

  return res.data || [];
}

export async function registrarEntrega(data) {
  try {
    const response = await fetch(`${BASE_URL}/index.php?url=entregas&action=registrarEntrega`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!json.status && !json.success) {
      throw new Error(json.msj || 'Error al registrar la entrega.');
    }
    return json;
  } catch (error) {
    console.error('Error en registrarEntrega:', error);
    throw error;
  }
}

export async function actualizarEntrega(data) {
  try {
    const response = await fetch(`${BASE_URL}/index.php?url=entregas&action=actualizarEntrega`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!json.status && !json.success) {
      throw new Error(json.msj || 'Error al actualizar la entrega.');
    }
    return json;
  } catch (error) {
    console.error('Error en actualizarEntrega:', error);
    throw error;
  }
}