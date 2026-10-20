// Same structure as the web system sidebar.
// `modulo` = list endpoint, `info` = static text view.
export const MENU = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'ecommerce', label: 'Ecommerce', modulo: 'productos' },
  {
    label: 'Socios',
    children: [
      { key: 'clientes', label: 'Clientes', modulo: 'clientes' },
      { key: 'proveedores', label: 'Proveedores', modulo: 'proveedores' },
    ],
  },
  {
    label: 'Catálogo',
    children: [
      { key: 'categorias', label: 'Categorías', modulo: 'categorias' },
      { key: 'productos', label: 'Productos', modulo: 'productos' },
    ],
  },
  {
    label: 'Inventario',
    children: [
      { key: 'materias', label: 'Materias Primas', modulo: 'materias' },
      { key: 'producciones', label: 'Producciones', modulo: 'producciones' },
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
    label: 'Reportes',
    children: [
      { key: 'reportes_generales', label: 'Reportes Generales', info: 'Los reportes en PDF y gráficas se generan desde el sistema web.' },
      { key: 'reportes_estadisticos', label: 'Reportes Estadísticos', info: 'Las estadísticas y gráficas se consultan desde el sistema web.' },
      { key: 'inteligencia', label: 'Inteligencia de Negocio', info: 'La inteligencia de negocio se consulta desde el sistema web.' },
    ],
  },
  {
    label: 'Configuración',
    children: [
      { key: 'tipos_clientes', label: 'Tipos de Clientes', modulo: 'tipos_clientes' },
      { key: 'notificaciones', label: 'Notificaciones', modulo: 'notificaciones' },
      { key: 'tasa', label: 'Tasa Cambiaria', modulo: 'tasa' },
      { key: 'moneda', label: 'Monedas', modulo: 'moneda' },
      { key: 'unidades', label: 'Unidades de Medida', modulo: 'unidades' },
      { key: 'camiones', label: 'Camiones', modulo: 'camiones' },
      { key: 'roles', label: 'Roles y Permisos', modulo: 'roles' },
      { key: 'modulos', label: 'Módulos', modulo: 'modulos' },
      { key: 'usuarios', label: 'Usuarios', modulo: 'usuarios' },
      { key: 'bitacora', label: 'Bitácora', modulo: 'bitacora' },
      { key: 'manual', label: 'Manual de Usuario', info: 'El manual de usuario completo está disponible en el sistema web.' },
      { key: 'respaldos', label: 'Respaldos', modulo: 'respaldos' },
    ],
  },
  { key: 'ayuda', label: 'Centro de Ayuda', info: 'Soporte: galletasnatys@gmail.com · +58 424 521 7016' },
];

// Flat list to look up a screen by key.
export const FLAT = MENU.flatMap((m) => (m.children ? m.children : [m]));
