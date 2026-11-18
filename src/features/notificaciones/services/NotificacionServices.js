import { request } from '../../../utils/http';

export async function getNotificaciones() {
  const response = await request('notificaciones&action=consultarNotificaciones', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar las notificaciones');
  }

  return res.data || [];
}

// Registrar notificación (POST)
export async function registrarNotificacion(data) {
  const response = await request('notificaciones&action=registrarNotificacion', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar la notificación');
  }

  return res;
}

// Modificar notificación (PUT)
export async function modificarNotificacion(data) {
  const response = await request('notificaciones&action=modificarNotificacion', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar la notificación');
  }

  return res;
}

// Eliminar notificación (DELETE)
export async function eliminarNotificacion(id) {
  const response = await request(`notificaciones&action=eliminarNotificacion&ID=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar la notificación');
  }

  return res;
}

// Marcar una notificación como leída (PUT)
export async function marcarLeidaNotificacion(id) {
  const response = await request('notificaciones&action=marcarLeidaNotificacion', {
    method: 'PUT',
    body: JSON.stringify({ id }),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo marcar la notificación como leída');
  }

  return res;
}

// Marcar todas las notificaciones como leídas (PUT)
export async function marcarTodasLeidasNotificacion() {
  const response = await request('notificaciones&action=marcarTodasLeidasNotificacion', {
    method: 'PUT',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron marcar las notificaciones como leídas');
  }

  return res;
}

// Limpiar notificaciones leídas (DELETE)
export async function limpiarLeidasNotificacion() {
  const response = await request('notificaciones&action=limpiarLeidasNotificacion', {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron limpiar las notificaciones leídas');
  }

  return res;
}

// Ver detalle de una notificación (GET)
export async function verNotificacion(id) {
  const response = await request(`notificaciones&action=verNotificacion&ID=${encodeURIComponent(id)}`, {
    method: 'GET',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo obtener la notificación');
  }

  return res;
}
