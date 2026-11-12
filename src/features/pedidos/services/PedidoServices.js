import { request } from '../../../utils/http';

export async function getPedidos() {
  const response = await request('pedidos&action=consultarPedidos', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los pedidos');
  }

  return res.data || [];
}