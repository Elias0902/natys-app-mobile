import { request } from '../../../utils/http';

// Consulta la lista de clientes desde tu API PHP
export async function getClientes() {
  const response = await request('clientes&action=consultarClientes', { method: 'GET' });
  
  // Tu API devuelve un arreglo que envuelve el objeto con la respuesta
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los clientes');
  }

  return res.data || [];
}