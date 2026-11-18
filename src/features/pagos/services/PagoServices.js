import { request } from '../../../utils/http';

export async function getPagos() {
  const response = await request('pagos&action=consultarPagos', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron cargar los pagos');
  }

  return {
    clientes: res.data_cliente || res.clientes || [],
    proveedores: res.data_proveedor || res.proveedores || []
  };
}

export async function registrarPago(data) {
  const response = await request('pagos&action=registrarPago', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar el pago');
  }

  return res;
}

export async function modificarPago(data) {
  const response = await request('pagos&action=modificarPago', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar el pago');
  }

  return res;
}

export async function eliminarPago(id, tipo = 'clientes') {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico.
  // "tipo" distingue pagos de clientes (tabla pagos) de pagos a proveedores.
  const response = await request(
    `pagos&action=eliminarPago&ID=${id}&id=${id}&tipo=${encodeURIComponent(tipo)}`,
    {
      method: 'DELETE',
    },
  );
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar el pago');
  }

  return res;
}