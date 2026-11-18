import { request } from '../../../utils/http';

// Consulta la lista de cuentas por cobrar desde tu API PHP
export async function getCuentaCobrar() {
  const response = await request('cuentaporcobrar&action=consultarCuentaCobrar', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron cargar las cuentas por cobrar');
  }

  return res.data || [];
}

// Alias conservado por compatibilidad con el nombre anterior
export const getCuentasCobrar = getCuentaCobrar;

export async function registrarCuentaCobrar(data) {
  const response = await request('cuentaporcobrar&action=registrarCuentaCobrar', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar la cuenta por cobrar');
  }

  return res;
}

export async function modificarCuentaCobrar(data) {
  const response = await request('cuentaporcobrar&action=modificarCuentaCobrar', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar la cuenta por cobrar');
  }

  return res;
}

export async function eliminarCuentaCobrar(id) {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico
  const response = await request(`cuentaporcobrar&action=eliminarCuentaCobrar&ID=${id}&id=${id}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar la cuenta por cobrar');
  }

  return res;
}