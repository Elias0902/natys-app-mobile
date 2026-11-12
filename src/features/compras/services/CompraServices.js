import { request } from '../../../utils/http';

// Consulta la lista de compras desde tu API PHP
export async function getCompras() {
  const response = await request('compras&action=consultarCompras', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar las compras');
  }

  return res.data || [];
}