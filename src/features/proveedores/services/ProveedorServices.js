import { request } from '../../../utils/http';

export async function getProveedores() {
  const response = await request('proveedores&action=consultarProveedores', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los proveedores');
  }

  return res.data || [];
}