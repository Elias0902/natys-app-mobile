import { request } from '../../../utils/http';

// Consulta la lista de cuentas por cobrar desde tu API PHP
export async function getCuentasCobrar() {
  const response = await request('cuentaporcobrar&action=consultarCuentaCobrar', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar las cuentas por cobrar');
  }

  return res.data || [];
}