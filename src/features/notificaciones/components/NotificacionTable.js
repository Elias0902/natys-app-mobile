import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';

const columns = [
  { key: 'id_notificaciones', label: 'ID', kind: 'id', minWidth: 60, primary: true, title: true },
  { key: 'titulo', label: 'Título', minWidth: 150, flex: 1.2, primary: true, words: 3, textStyle: { fontWeight: '700' } },
  { key: 'descripcion_notificacion', label: 'Descripción', minWidth: 140, flex: 1.2, secondary: true, words: 3 },
  { key: 'fecha_notificacion', label: 'Fecha', kind: 'date', minWidth: 150, primary: true },
  {
    key: 'tipo_notificacion',
    label: 'Tipo',
    kind: 'status',
    minWidth: 90,
    primary: true,
    tone: (n) => ({ bg: n.tipo_notificacion === 'alerta' ? '#b91c1c' : '#334155', fg: '#fff' }),
  },
];

export default function NotificacionTable({ notificaciones, onView, onEdit, onDelete, onMarcarLeida }) {
  // Cuatro acciones: el ancho del bloque se calcula en el componente compartido.
  const actions = (notificacion) => [
    { key: 'view', label: 'Ver notificación', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(notificacion) },
    { key: 'edit', label: 'Editar notificación', shortLabel: 'Editar', icon: 'edit', onPress: () => onEdit && onEdit(notificacion) },
    {
      key: 'read',
      label: 'Marcar como leída',
      shortLabel: 'Leída',
      icon: 'check',
      variant: 'success',
      onPress: () => onMarcarLeida && onMarcarLeida(notificacion),
    },
    { key: 'delete', label: 'Eliminar notificación', shortLabel: 'Eliminar', icon: 'trash', variant: 'danger', onPress: () => onDelete && onDelete(notificacion) },
  ];

  return (
    <ResponsiveCrudTable
      rows={notificaciones}
      columns={columns}
      rowKey={(n) => n.id_notificaciones}
      actions={actions}
      actionCount={4}
      emptyMessage="No se encontraron notificaciones."
    />
  );
}
