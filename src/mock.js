// Sample data used while USE_MOCK = true.
export const MOCK_USER = { id_usuario: 1, nombre_usuario: 'superusuario_24', email_usuario: 'admin@natys.com', rol_usuario: 'Superusuario' };
// Logging in as "cliente" opens the Ecommerce view (same as the web system for role Usuario).
export const MOCK_CLIENT = { id_usuario: 2, nombre_usuario: 'cliente', email_usuario: 'cliente@natys.com', rol_usuario: 'Usuario' };

export const MOCK = {
  clientes: [
    { id_cliente: 'V-22220449', nombre_cliente: 'Jesus Andrade', nombre_tipo_cliente: 'Bodegas', estado_cliente: 'Activo', telefono_cliente: '0412-2373552', sector_cliente: 'Sur' },
    { id_cliente: 'V-25566582', nombre_cliente: 'Miguel Bose', nombre_tipo_cliente: 'Bodegas', estado_cliente: 'Activo', telefono_cliente: '0412-2373552', sector_cliente: 'Sur' },
    { id_cliente: 'J-32200771', nombre_cliente: 'Mi Super ca', nombre_tipo_cliente: 'Distribuidores', estado_cliente: 'Activo', telefono_cliente: '0251-4408820', sector_cliente: 'Oeste' },
    { id_cliente: 'J-31038871', nombre_cliente: 'PaTodo', nombre_tipo_cliente: 'Sucursales', estado_cliente: 'Activo', telefono_cliente: '0251-3213495', sector_cliente: 'Centro' },
    { id_cliente: 'J-17100986', nombre_cliente: 'Farmatodo', nombre_tipo_cliente: 'Empresarios', estado_cliente: 'Pendiente', telefono_cliente: '0251-1358621', sector_cliente: 'Oeste' },
  ],
  proveedores: [{ id_proveedor: 'J-1', nombre_proveedor: 'Proveedor Demo', telefono: '04120000000' }],
  categorias: [{ id_categoria: 1, nombre_categoria: 'Galletas Dulces' }, { id_categoria: 2, nombre_categoria: 'Galletas Saladas' }],
  productos: [
    { id_producto: 1, nombre_producto: 'Galletas dulces Natys con sabor a coco 90g', nombre_categoria: 'Galletas Dulces', precio_venta: 2.5, stock: 964 },
    { id_producto: 2, nombre_producto: 'Galletas dulces Natys con sabor a vainilla 90g', nombre_categoria: 'Galletas Dulces', precio_venta: 2.5, stock: 520 },
    { id_producto: 3, nombre_producto: 'Galletas dulces Natys con chocolate 90g', nombre_categoria: 'Galletas Dulces', precio_venta: 2.8, stock: 310 },
    { id_producto: 4, nombre_producto: 'Galletas saladas Natys clásicas 120g', nombre_categoria: 'Galletas Saladas', precio_venta: 2.2, stock: 400 },
    { id_producto: 5, nombre_producto: 'Galletas saladas Natys con ajonjolí 120g', nombre_categoria: 'Galletas Saladas', precio_venta: 2.4, stock: 150 },
    { id_producto: 6, nombre_producto: 'Caja surtida Natys 12 und', nombre_categoria: 'Galletas Dulces', precio_venta: 24, stock: 60 },
  ],
  materias: [{ id_materia: 1, nombre_materia: 'Harina de trigo', stock: 120, unidad: 'kg' }],
  producciones: [{ id_produccion: 1, producto: 'Galletas coco 90g', cantidad: 500, fecha: '2026-09-08' }],
  pedidos: [{ id_pedido: 17, cliente: 'PaTodo', total: '$700.00', estado: 'Pagado' }],
  entregas: [{ id_entrega: 1, pedido: 17, direccion: 'Av Pedro Leon con calle 54', estado: 'Pendiente' }],
  compras: [{ id_compra: 1, proveedor: 'Proveedor Demo', total: '$350.00', estado: 'Recibida' }],
  promociones: [{ id_promocion: 1, nombre: '2x1 galletas dulces', estado: 'Activa' }],
  pagos: [
    { id_pago: 15, fecha_pago: '08 Sep 2026, 9:08pm', monto: 700, estado: 'Pagado' },
    { id_pago: 12, fecha_pago: '08 Sep 2026, 8:51pm', monto: 350, estado: 'Pagado' },
    { id_pago: 8, fecha_pago: '30 Nov 2026', monto: 3.5, estado: 'Por Pagar' },
  ],
  cobrar: [{ id_cuenta: 1, cliente: 'Mi Super ca', monto: '$350.00', estado: 'Por Cobrar' }],
  pagar: [{ id_cuenta: 1, proveedor: 'Proveedor Demo', monto: '$3.50', estado: 'Por Pagar' }],
  tipos_clientes: [{ id: 1, nombre: 'Bodegas' }, { id: 2, nombre: 'Distribuidores' }, { id: 3, nombre: 'Sucursales' }],
  notificaciones: [{ id: 1, mensaje: 'Nuevo pedido registrado', fecha: '2026-10-20' }],
  tasa: [{ id: 1, nombre: 'USDT', valor: '1005.65 Bs/$' }, { id: 2, nombre: 'BCV', valor: '881.88 Bs/$' }],
  moneda: [{ id: 1, nombre: 'Dólar', simbolo: '$' }, { id: 2, nombre: 'Bolívar', simbolo: 'Bs' }],
  unidades: [{ id: 1, nombre: 'Kilogramo', abreviatura: 'kg' }],
  camiones: [{ id: 1, placa: 'AB123CD', estado: 'Disponible' }],
  roles: [{ id: 1, nombre: 'Administrador', descripcion: 'Control Total' }, { id: 2, nombre: 'Vendedor', descripcion: 'Ventas y Pagos' }, { id: 3, nombre: 'Repartidor', descripcion: 'Entrega' }],
  modulos: [{ id: 1, nombre: 'Clientes' }, { id: 2, nombre: 'Pedidos' }],
  usuarios: [{ id: 1, nombre: 'superusuario_24', rol: 'Superusuario' }, { id: 2, nombre: 'Jesus Andrade', rol: 'Usuario' }],
  bitacora: [{ id: 1, accion: 'LOGIN', usuario: 'superusuario_24', fecha: '2026-10-20 16:44' }],
  respaldos: [{ id: 1, bd: 'larence', fecha: '2026-10-19', estado: 'Completado' }],
};
