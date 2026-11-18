import { request } from '../../../utils/http';

export async function getPedidos() {
  const response = await request('pedidos&action=consultarPedidos', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron cargar los pedidos');
  }

  return res.data || [];
}

// Catálogos para los formularios de pedidos
export async function getEstadosPedidoSelect() {
  const response = await request('pedidos&action=obtenerEstadosPedidoSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los estados de pedido');
  }

  return res.data || [];
}

export async function getPedidosSelect() {
  const response = await request('pedidos&action=obtenerPedidosSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los pedidos');
  }

  return res.data || [];
}

export async function registrarPedido(data) {
  const response = await request('pedidos&action=registrarPedido', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar el pedido');
  }

  return res;
}

export async function modificarPedido(data) {
  const response = await request('pedidos&action=modificarPedido', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar el pedido');
  }

  return res;
}

export async function eliminarPedido(id) {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico
  const response = await request(`pedidos&action=eliminarPedido&ID=${id}&id=${id}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar el pedido');
  }

  return res;
}