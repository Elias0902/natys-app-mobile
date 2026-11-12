import { request } from '../../../utils/http';

// Consulta la lista de cuentas por pagar desde tu API PHP
export async function getCuentasPagar() {
  const response = await request('cuentaporpagar&action=consultarCuentaPagar', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar las cuentas por pagar');
  }

  return res.data || [];
}