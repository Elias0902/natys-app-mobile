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

// Registrar el pedido del carrito contra tu backend
export async function createOrder(orderData) {
  const json = await request('pedido_movil.php', { 
    method: 'POST', 
    body: orderData 
  });
  
  if (!json.status && !json.success) {
    throw new Error(json.message || 'No se pudo registrar el pedido');
  }
  return json;
}