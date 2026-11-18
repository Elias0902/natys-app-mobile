import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';

const isActive = (promocion) => promocion.estado === 1 || promocion.status === 1;

const columns = [
  { key: 'id_promocion', label: 'ID', kind: 'id', minWidth: 60, primary: true, title: true },
  { key: 'nombre_promocion', label: 'Nombre de Promoción', minWidth: 160, flex: 1.5, primary: true, textStyle: { fontWeight: '700' } },
  { key: 'descripcion_promocion', label: 'Descripción', minWidth: 140, flex: 1.2, secondary: true, words: 3 },
  {
    key: 'tipo_descuento',
    label: 'Tipo de Descuento',
    minWidth: 120,
    primary: true,
    value: (p) => (p.valor_descuento !== undefined ? `${p.tipo_descuento} (${p.valor_descuento})` : p.tipo_descuento),
  },
  {
    key: 'fecha_inicio',
    label: 'Vigencia',
    kind: 'date',
    minWidth: 170,
    secondary: true,
    value: (p) => (p.fecha_fin ? `${p.fecha_inicio} al ${p.fecha_fin}` : p.fecha_inicio),
  },
  {
    key: 'estado',
    label: 'Estado',
    kind: 'status',
    minWidth: 90,
    primary: true,
    value: (p) => (isActive(p) ? 'Activa' : 'Inactiva'),
    tone: (p) => ({ bg: isActive(p) ? '#16a34a' : '#b91c1c', fg: '#fff' }),
  },
];

export default function PromocionTable({ promociones, onView, onEdit, onDelete }) {
  const actions = (promocion) => [
    { key: 'view', label: 'Ver promoción', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(promocion) },
    { key: 'edit', label: 'Editar promoción', shortLabel: 'Editar', icon: 'edit', onPress: () => onEdit && onEdit(promocion) },
    { key: 'delete', label: 'Eliminar promoción', shortLabel: 'Eliminar', icon: 'trash', variant: 'danger', onPress: () => onDelete && onDelete(promocion) },
  ];

  return (
    <ResponsiveCrudTable
      rows={promociones}
      columns={columns}
      rowKey={(p) => p.id_promocion}
      actions={actions}
      actionCount={3}
      emptyMessage="No se encontraron promociones."
    />
  );
}
