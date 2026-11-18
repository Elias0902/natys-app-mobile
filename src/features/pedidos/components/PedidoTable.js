import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';
import { colors } from '../../../utils/theme';

const columns = [
  { key: 'id_pedido', label: 'ID', kind: 'id', minWidth: 60, primary: true, title: true },
  { key: 'nombre_cliente', label: 'Cliente', minWidth: 130, primary: true },
  {
    key: 'productos',
    label: 'Producto',
    minWidth: 120,
    flex: 1.2,
    primary: true,
    numberOfLines: 1,
    words: 3,
    value: (p) => (p.cantidades ? `${p.productos} (x${p.cantidades})` : p.productos),
  },
  { key: 'monto_total_pedido', label: 'Total', kind: 'money', minWidth: 90, primary: true },
  { key: 'pago', label: 'Pago', minWidth: 90, secondary: true, textStyle: { color: '#fbbf24' } },
  {
    key: 'nombre_estado',
    label: 'Estado',
    kind: 'status',
    minWidth: 90,
    primary: true,
    tone: { bg: colors.red, fg: '#fff' },
  },
  { key: 'fecha_pedido', label: 'Fecha', kind: 'date', minWidth: 90, secondary: true, value: (p) => String(p.fecha_pedido || '').split(' ')[0] },
];

export default function PedidoTable({ pedidos, onView, onEdit, onDelete }) {
  const actions = (pedido) => [
    { key: 'view', label: 'Ver pedido', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(pedido) },
    { key: 'edit', label: 'Editar pedido', shortLabel: 'Editar', icon: 'edit', onPress: () => onEdit && onEdit(pedido) },
    { key: 'delete', label: 'Eliminar pedido', shortLabel: 'Eliminar', icon: 'trash', variant: 'danger', onPress: () => onDelete && onDelete(pedido) },
  ];

  return (
    <ResponsiveCrudTable
      rows={pedidos}
      columns={columns}
      rowKey={(p) => p.id_pedido}
      actions={actions}
      actionCount={3}
      emptyMessage="No se encontraron pedidos."
    />
  );
}
