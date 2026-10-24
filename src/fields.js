// Form fields of each module (used by Registrar / Modificar).
// type: 'text' | 'number' | 'date' | 'select' (with options)
// The id field is generated automatically unless `idEditable` is set (e.g. RIF of a provider).
const ESTADO = (options) => ({ key: 'estado', label: 'Estado', type: 'select', options });

export const FIELDS = {
  proveedores: {
    singular: 'Proveedor',
    id: 'id_proveedor', idEditable: true, idLabel: 'RIF',
    fields: [
      { key: 'nombre_proveedor', label: 'Nombre', required: true },
      { key: 'telefono', label: 'Teléfono' },
    ],
  },
  pedidos: {
    singular: 'Pedido',
    id: 'id_pedido',
    fields: [
      { key: 'cliente', label: 'Cliente', required: true },
      { key: 'total', label: 'Total', type: 'number', required: true },
      ESTADO(['Pendiente', 'Pagado', 'Anulado']),
    ],
  },
  entregas: {
    singular: 'Entrega',
    id: 'id_entrega',
    fields: [
      { key: 'pedido', label: 'N° de pedido', type: 'number', required: true },
      { key: 'direccion', label: 'Dirección', required: true },
      ESTADO(['Pendiente', 'En camino', 'Entregado']),
    ],
  },
  compras: {
    singular: 'Compra',
    id: 'id_compra',
    fields: [
      { key: 'proveedor', label: 'Proveedor', required: true },
      { key: 'total', label: 'Total', type: 'number', required: true },
      ESTADO(['Pendiente', 'Recibida', 'Anulada']),
    ],
  },
  promociones: {
    singular: 'Promoción',
    id: 'id_promocion',
    fields: [
      { key: 'nombre', label: 'Nombre', required: true },
      ESTADO(['Activa', 'Inactiva']),
    ],
  },
  pagos: {
    singular: 'Pago',
    id: 'id_pago',
    fields: [
      { key: 'fecha_pago', label: 'Fecha de pago', type: 'date', required: true },
      { key: 'monto', label: 'Monto', type: 'number', required: true },
      ESTADO(['Pagado', 'Por Pagar', 'Anulado']),
    ],
  },
  cobrar: {
    singular: 'Cuenta por Cobrar',
    id: 'id_cuenta',
    fields: [
      { key: 'cliente', label: 'Cliente', required: true },
      { key: 'monto', label: 'Monto', type: 'number', required: true },
      ESTADO(['Por Cobrar', 'Cobrado']),
    ],
  },
  pagar: {
    singular: 'Cuenta por Pagar',
    id: 'id_cuenta',
    fields: [
      { key: 'proveedor', label: 'Proveedor', required: true },
      { key: 'monto', label: 'Monto', type: 'number', required: true },
      ESTADO(['Por Pagar', 'Pagado']),
    ],
  },
  notificaciones: {
    singular: 'Notificación',
    id: 'id',
    fields: [
      { key: 'mensaje', label: 'Mensaje', required: true },
      { key: 'fecha', label: 'Fecha', type: 'date', required: true },
    ],
  },
};

// Fallback for a module without a definition: build the form from an existing record
export function fieldsFor(modulo, sample) {
  if (FIELDS[modulo]) return FIELDS[modulo];
  const keys = Object.keys(sample || {});
  const id = keys.find((k) => /^id/.test(k)) || 'id';
  return { id, singular: 'Registro', fields: keys.filter((k) => k !== id).map((k) => ({ key: k, label: k.replace(/_/g, ' ') })) };
}
