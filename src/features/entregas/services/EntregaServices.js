import { request } from '../../../utils/http';

export async function getEntregas() {
  const response = await request('entregas&action=consultarEntregas', { method: 'GET' });
    
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudieron cargar las entregas');
  }

  return res.data || [];
}

// Catálogos para los formularios de entregas
export async function getEstadosEntregaSelect() {
  const response = await request('entregas&action=obtenerEstadosEntregaSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los estados de entrega');
  }

  return res.data || [];
}

export async function getSectoresSelect() {
  const response = await request('entregas&action=obtenerSectoresSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los sectores');
  }

  return res.data || [];
}

// Camiones disponibles para despacho (módulo camiones de la API)
export async function getCamionesSelect() {
  const response = await request('camiones&action=obtenerCamionesSelect', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los camiones');
  }

  return res.data || [];
}

// Cascada sector -> cliente -> pedido
export async function getClientesPorSector(sector) {
  const response = await request(
    `entregas&action=obtenerClientesPorSectorSelect&sector=${encodeURIComponent(sector ?? '')}`,
    { method: 'GET' },
  );
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los clientes del sector');
  }

  return res.data || [];
}

export async function getPedidosPorCliente(clienteId, currentPedidoId = null) {
  const actual = currentPedidoId ? `&current_pedido_id=${encodeURIComponent(currentPedidoId)}` : '';
  const response = await request(
    `entregas&action=obtenerPedidosPorClienteSelect&cliente_id=${encodeURIComponent(clienteId ?? '')}${actual}`,
    { method: 'GET' },
  );
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los pedidos del cliente');
  }

  return res.data || [];
}

export async function registrarEntrega(data) {
  const response = await request('entregas&action=registrarEntrega', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar la entrega');
  }

  return res;
}

export async function modificarEntrega(data) {
  const response = await request('entregas&action=modificarEntrega', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar la entrega');
  }

  return res;
}

// Alias conservado por compatibilidad con código que usaba el nombre anterior
export const actualizarEntrega = modificarEntrega;

export async function eliminarEntrega(id) {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico
  const response = await request(`entregas&action=eliminarEntrega&ID=${id}&id=${id}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar la entrega');
  }

  return res;
}