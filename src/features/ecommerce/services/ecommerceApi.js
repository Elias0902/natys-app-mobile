import { USE_MOCK } from '../../../utils/config';
import { request } from '../../../utils/http';
import { getList } from '../../modulos/services/modulosApi';

export const getProductos = () => getList('productos');

// Order from the cart (see php/pedido_movil.php). The server sets prices and total.
export async function createOrder(order) {
  if (USE_MOCK) return { message: 'Pedido registrado (modo demo).' };
  const json = await request('pedido_movil.php', { method: 'POST', body: order });
  if (!json.status) throw new Error(json.message || 'No se pudo registrar el pedido');
  return json;
}
