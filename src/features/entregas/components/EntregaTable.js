import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';
import { colors } from '../../../utils/theme';

const columns = [
  { key: 'id_entregas', label: 'ID', kind: 'id', minWidth: 60, primary: true, title: true },
  { key: 'cliente_nombre', label: 'Cliente', minWidth: 150, flex: 1.5, primary: true },
  {
    key: 'camion_placa',
    label: 'Camión',
    minWidth: 140,
    flex: 1.2,
    primary: true,
    value: (e) => (e.camion_modelo ? `${e.camion_placa} (${e.camion_modelo})` : e.camion_placa),
  },
  { key: 'repartidor', label: 'Repartidor', minWidth: 130, flex: 1.2, secondary: true },
  { key: 'fecha_programada', label: 'Fecha Prog.', kind: 'date', minWidth: 100, secondary: true },
  { key: 'estado', label: 'Estado', kind: 'status', minWidth: 100, primary: true, tone: { bg: colors.red, fg: '#fff' } },
];

export default function EntregaTable({ entregas, onView, onEdit, onDelete }) {
  const actions = (entrega) => [
    { key: 'view', label: 'Ver entrega', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(entrega) },
    { key: 'edit', label: 'Editar entrega', shortLabel: 'Editar', icon: 'edit', onPress: () => onEdit && onEdit(entrega) },
    { key: 'delete', label: 'Eliminar entrega', shortLabel: 'Eliminar', icon: 'trash', variant: 'danger', onPress: () => onDelete && onDelete(entrega) },
  ];

  return (
    <ResponsiveCrudTable
      rows={entregas}
      columns={columns}
      rowKey={(e) => e.id_entregas}
      actions={actions}
      actionCount={3}
      emptyMessage="No se encontraron entregas."
    />
  );
}
