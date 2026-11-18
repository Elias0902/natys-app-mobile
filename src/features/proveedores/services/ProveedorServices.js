import { request } from '../../../utils/http';

export async function getProveedores() {
  const response = await request('proveedores&action=consultarProveedores', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron cargar los proveedores');
  }

  return res.data || [];
}

// Catálogo ligero de proveedores activos para selectors
export async function getProveedoresSelect() {
  const response = await request('proveedores&action=obtenerProveedoresSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los proveedores');
  }

  return res.data || [];
}

export async function registrarProveedor(data) {
  const response = await request('proveedores&action=registrarProveedor', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar el proveedor');
  }

  return res;
}

export async function modificarProveedor(data) {
  const response = await request('proveedores&action=modificarProveedor', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar el proveedor');
  }

  return res;
}

export async function eliminarProveedor(id) {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico
  const response = await request(`proveedores&action=eliminarProveedor&ID=${id}&id=${id}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar el proveedor');
  }

  return res;
}