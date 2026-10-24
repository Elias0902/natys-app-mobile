// Modules approved for the mobile app (subset of the web system sidebar).
// `modulo` = list endpoint, `info` = static text view, `icon` = name from components/Icon.js.
// Children of a group get the group's icon and name (used in the page title and breadcrumb).
const group = (label, icon, children) => ({
  label,
  icon,
  children: children.map((c) => ({ ...c, icon, group: label })),
});

export const MENU = [
  { key: 'ecommerce', label: 'Ecommerce', modulo: 'productos', icon: 'bag' },
  group('Socios', 'users', [
    { key: 'proveedores', label: 'Proveedores', modulo: 'proveedores' },
  ]),
  group('Comercial', 'briefcase', [
    { key: 'pedidos', label: 'Pedidos', modulo: 'pedidos' },
    { key: 'entregas', label: 'Entregas', modulo: 'entregas' },
    { key: 'compras', label: 'Compras', modulo: 'compras' },
    { key: 'promociones', label: 'Promociones', modulo: 'promociones' },
  ]),
  group('Finanzas', 'dollar', [
    { key: 'pagos', label: 'Pagos', modulo: 'pagos' },
    { key: 'cobrar', label: 'Cuentas por Cobrar', modulo: 'cobrar' },
    { key: 'pagar', label: 'Cuentas por Pagar', modulo: 'pagar' },
  ]),
  group('Configuración', 'sliders', [
    { key: 'notificaciones', label: 'Notificaciones', modulo: 'notificaciones' },
  ]),
  { key: 'ayuda', label: 'Centro de Ayuda', icon: 'help', info: 'Soporte: galletasnatys@gmail.com · +58 424 521 7016' },
];

// Flat list to look up a screen by key.
export const FLAT = MENU.flatMap((m) => (m.children ? m.children : [m]));
