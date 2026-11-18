import { request } from '../../../utils/http';

// Consulta la lista de compras desde tu API PHP
export async function getCompras() {
  const response = await request('compras&action=consultarCompras', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron cargar las compras');
  }

  return res.data || [];
}

// Catálogos para los formularios de compras
export async function getMateriasPrimasSelect() {
  const response = await request('compras&action=obtenerMateriasPrimasSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar las materias primas');
  }

  return res.data || [];
}

export async function getEstadosPagoSelect() {
  const response = await request('compras&action=obtenerEstadosPagoSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los estados de pago');
  }

  return res.data || [];
}

export async function registrarCompra(data) {
  const response = await request('compras&action=registrarCompra', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar la compra');
  }

  return res;
}

export async function modificarCompra(data) {
  const response = await request('compras&action=modificarCompra', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar la compra');
  }

  return res;
}

export async function eliminarCompra(id) {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico
  const response = await request(`compras&action=eliminarCompra&ID=${id}&id=${id}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar la compra');
  }

  return res;
}