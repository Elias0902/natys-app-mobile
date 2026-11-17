import { request } from '../../../utils/http';

export async function getPromociones() {
  const response = await request('promociones&action=consultarPromociones', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar las promociones');
  }

  return res.data || [];
}