import { request } from '../../../utils/http';

export async function getPromociones() {
  const response = await request('promociones&action=consultarPromociones', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron cargar las promociones');
  }

  return res.data || [];
}

// Catálogos para los formularios de promociones
export async function getTiposPromocion() {
  const response = await request('promociones&action=obtenerTiposPromocionSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los tipos de promoción');
  }

  return res.data || [];
}

export async function getEstadosPromocion() {
  const response = await request('promociones&action=obtenerEstadosPromocionSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los estados de promoción');
  }

  return res.data || [];
}

export async function registrarPromocion(data) {
  const response = await request('promociones&action=registrarPromocion', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar la promoción');
  }

  return res;
}

export async function modificarPromocion(data) {
  const response = await request('promociones&action=modificarPromocion', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar la promoción');
  }

  return res;
}

export async function eliminarPromocion(id) {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico
  const response = await request(`promociones&action=eliminarPromocion&ID=${id}&id=${id}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar la promoción');
  }

  return res;
}