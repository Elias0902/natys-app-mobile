// Modules approved for the mobile app (subset of the web system sidebar).
// `modulo` = list endpoint, `info` = static text view.
export const MENU = [
  { key: 'ecommerce', label: 'Ecommerce', modulo: 'productos' },
  {
    label: 'Socios',
    children: [
      { key: 'proveedores', label: 'Proveedores', modulo: 'proveedores' },
    ],
  },
  {
    label: 'Comercial',
    children: [
      { key: 'pedidos', label: 'Pedidos', modulo: 'pedidos' },
      { key: 'entregas', label: 'Entregas', modulo: 'entregas' },
      { key: 'compras', label: 'Compras', modulo: 'compras' },
      { key: 'promociones', label: 'Promociones', modulo: 'promociones' },
    ],
  },
  {
    label: 'Finanzas',
    children: [
      { key: 'pagos', label: 'Pagos', modulo: 'pagos' },
      { key: 'cobrar', label: 'Cuentas por Cobrar', modulo: 'cobrar' },
      { key: 'pagar', label: 'Cuentas por Pagar', modulo: 'pagar' },
    ],
  },
  {
    label: 'Configuración',
    children: [
      { key: 'notificaciones', label: 'Notificaciones', modulo: 'notificaciones' },
    ],
  },
  { key: 'ayuda', label: 'Centro de Ayuda', info: 'Soporte: galletasnatys@gmail.com · +58 424 521 7016' },
];

// Flat list to look up a screen by key.
export const FLAT = MENU.flatMap((m) => (m.children ? m.children : [m]));
