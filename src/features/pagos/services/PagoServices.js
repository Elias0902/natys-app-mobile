import { request } from '../../../utils/http';

export async function getPagos() {
  const response = await request('pagos&action=consultarPagos', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los pagos');
  }

  return {
    clientes: res.data_cliente || [],
    proveedores: res.data_proveedor || []
  };
}