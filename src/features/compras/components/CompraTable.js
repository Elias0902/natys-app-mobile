import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';

// Los valores del servicio pueden traer tags HTML simples (<br>).
const cleanHtmlText = (text) => {
  if (!text) return '';
  return String(text).replace(/<br\s*[\/]?>/gi, ' - ');
};

const isPaid = (compra) => compra.id_estado_pago === 2 || compra.pago === 'Pagado';

const columns = [
  { key: 'id_compra', label: 'ID', kind: 'id', minWidth: 60, primary: true, title: true },
  { key: 'nombre_proveedor', label: 'Proveedor', minWidth: 160, flex: 2, primary: true, textStyle: { fontWeight: '700' } },
  { key: 'fecha_compra', label: 'Fecha', kind: 'date', minWidth: 100, primary: true, value: (c) => (c.fecha_compra ? c.fecha_compra.split(' ')[0] : '') },
  { key: 'materiaPrima', label: 'Materia Prima', minWidth: 130, flex: 1.2, secondary: true, words: 3, value: (c) => cleanHtmlText(c.materiaPrima) },
  {
    key: 'monto_total_compra',
    label: 'Monto ($)',
    minWidth: 90,
    primary: true,
    value: (c) => `$${c.monto_total_compra}`,
    textStyle: { textAlign: 'right', color: '#fbbf24', fontWeight: '700' },
  },
  {
    key: 'pago',
    label: 'Estado',
    kind: 'status',
    minWidth: 100,
    primary: true,
    tone: (c) => ({
      bg: isPaid(c) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
      fg: '#fff',
    }),
  },
];

export default function CompraTable({ compras, onView, onEdit, onDelete }) {
  const actions = (compra) => [
    { key: 'view', label: 'Ver compra', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(compra) },
    { key: 'edit', label: 'Editar compra', shortLabel: 'Editar', icon: 'edit', onPress: () => onEdit && onEdit(compra) },
    { key: 'delete', label: 'Eliminar compra', shortLabel: 'Eliminar', icon: 'trash', variant: 'danger', onPress: () => onDelete && onDelete(compra) },
  ];

  return (
    <ResponsiveCrudTable
      rows={compras}
      columns={columns}
      rowKey={(c) => c.id_compra}
      actions={actions}
      actionCount={3}
      emptyMessage="No se encontraron compras."
    />
  );
}
