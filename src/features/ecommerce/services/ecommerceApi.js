import { request } from '../../../utils/http';

// Consulta el catálogo de productos y categorías desde el endpoint real de PHP
export async function getProductos() {
  const data = await request('ecommerce&action=consultarEcommerce', { method: 'GET' });

  if (!data.success && !data.status) {
    throw new Error(data.message || 'No se pudieron cargar los productos');
  }

  // Tu API devuelve { success: true, productos: [...], categorias: [...] }
  return data.productos || [];
}

// Registrar el pedido del carrito contra el checkout real de la API.
// El backend devuelve [{ status, msj, pedido_id }] siguiendo el patrón de la app.
export async function createOrder(orderData) {
  const json = await request('pedidos&action=completarPedidoMovil', {
    method: 'POST',
    body: orderData,
  });

  const data = Array.isArray(json) ? json[0] : json;
  if (!data || (!data.status && !data.success)) {
    throw new Error(data?.message || data?.msj || 'No se pudo registrar el pedido');
  }
  return data;
}
