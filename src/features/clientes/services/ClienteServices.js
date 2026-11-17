import { request } from '../../../utils/http';

// Consultar la lista de clientes
export async function getClientes() {
  const response = await request('clientes&action=consultarClientes', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los clientes');
  }

  return res.data || [];
}

// Consultar los tipos de cliente para los selectores
export async function getTiposCliente() {
  // Ajusta el endpoint según la ruta de tu API para tipos de cliente
  const response = await request('clientes&action=obtenerTiposClientes', { method: 'GET' });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || !res.status) {
    throw new Error(res?.msj || 'No se pudieron cargar los tipos de cliente');
  }

  return res.data || [];
}

// Registrar un nuevo cliente (POST)
export async function registrarCliente(data) {
  const response = await request('clientes&action=registrarCliente', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo registrar el cliente');
  }

  return res;
}

// Modificar un cliente existente (PUT)
export async function modificarCliente(data) {
  const response = await request('clientes&action=modificarCliente', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo modificar el cliente');
  }

  return res;
}

// Eliminar un cliente (DELETE)
export async function eliminarCliente(id) {
  // Enviamos tanto ID como id por si el backend PHP evalúa alguno en específico
  const response = await request(`clientes&action=eliminarCliente&ID=${id}&id=${id}`, {
    method: 'DELETE',
  });
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || (!res.status && !res.success)) {
    throw new Error(res?.message || res?.msj || 'No se pudo eliminar el cliente');
  }

  return res;
}