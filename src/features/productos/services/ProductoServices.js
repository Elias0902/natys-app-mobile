import { request } from '../../../utils/http';

export async function getProductos() {
  const response = await request('productos&action=consultarProductos', { method: 'GET' });
  
  const res = Array.isArray(response) ? response[0] : response;

  if (!res || res.success === false) {
    throw new Error(res?.msj || 'No se pudieron cargar los productos');
  }

  return {
    productos: res.productos || [],
    categorias: res.categorias || [],
  };
}