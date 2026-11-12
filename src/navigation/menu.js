// Modules approved for the mobile app (subset of the web system sidebar).
const group = (label, icon, children) => ({
  label,
  icon,
  children: children.map((c) => ({ ...c, icon, group: label })),
});

export const MENU = [
  { key: 'ecommerce', label: 'Ecommerce', modulo: 'productos', icon: 'bag' },
  // Si deseas un módulo separado de Productos además del Ecommerce, puedes agregarlo así:
  { key: 'productos_lista', label: 'Productos', modulo: 'productos', icon: 'tag' }, 
  group('Socios', 'users', [
    { key: 'clientes', label: 'Clientes', modulo: 'clientes' },
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

export const FLAT = MENU.flatMap((m) => (m.children ? m.children : [m]));

// Filtra el menú exigiendo que el módulo esté presente en `user.modulos` con acceso
export function menuFor(user) {
  const modulosPermitidos = user?.modulos || [];
  const allowed = (item) => !item.modulo || modulosPermitidos.includes(item.modulo);

  return MENU.filter(allowed)
    .map((m) => (m.children ? { ...m, children: m.children.filter(allowed) } : m))
    .filter((m) => !m.children || m.children.length > 0);
}