import { request } from '../../../utils/http';

export async function getNotificaciones() {
  const response = await request('notificaciones&action=consultarNotificaciones', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar las notificaciones');
  }

  return res.data || [];
}