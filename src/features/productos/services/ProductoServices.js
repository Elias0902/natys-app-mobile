import { request } from '../../../utils/http';

export async function getProductos() {
  const response = await request('productos&action=consultarProductos', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron cargar los productos');
  }

  return {
    productos: res.productos || [],
    categorias: res.categorias || [],
  };
}

// Catálogo ligero de productos activos para selectors
export async function getProductosSelect() {
  const response = await request('productos&action=obtenerProductosSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los productos');
  }

  return res.data || [];
}

export async function registrarProducto(data) {
  const response = await request('productos&action=registrarProducto', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar el producto');
  }

  return res;
}

export async function modificarProducto(data) {
  const response = await request('productos&action=modificarProducto', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar el producto');
  }

  return res;
}

export async function eliminarProducto(id) {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico
  const response = await request(`productos&action=eliminarProducto&ID=${id}&id=${id}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar el producto');
  }

  return res;
}