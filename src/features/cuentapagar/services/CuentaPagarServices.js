import { request } from '../../../utils/http';

// Consulta la lista de cuentas por pagar desde tu API PHP
export async function getCuentaPagar() {
  const response = await request('cuentaporpagar&action=consultarCuentaPagar', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron cargar las cuentas por pagar');
  }

  return res.data || [];
}

// Alias conservado por compatibilidad con el nombre anterior
export const getCuentasPagar = getCuentaPagar;

export async function registrarCuentaPagar(data) {
  const response = await request('cuentaporpagar&action=registrarCuentaPagar', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar la cuenta por pagar');
  }

  return res;
}

export async function modificarCuentaPagar(data) {
  const response = await request('cuentaporpagar&action=modificarCuentaPagar', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar la cuenta por pagar');
  }

  return res;
}

export async function eliminarCuentaPagar(id) {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico
  const response = await request(`cuentaporpagar&action=eliminarCuentaPagar&ID=${id}&id=${id}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar la cuenta por pagar');
  }

  return res;
}