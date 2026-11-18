import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';

const columns = [
  {
    key: 'id_proveedor',
    label: 'RIF / ID',
    kind: 'id',
    prefix: '',
    minWidth: 110,
    primary: true,
    title: true,
    value: (p) => (p.tipo_id ? `${p.tipo_id}${p.id_proveedor}` : p.id_proveedor),
  },
  { key: 'nombre_proveedor', label: 'Nombre Proveedor', minWidth: 150, flex: 1.5, primary: true, textStyle: { fontWeight: '700' } },
  { key: 'tlf_proveedor', label: 'Teléfono', minWidth: 120, primary: true },
  { key: 'email_proveedor', label: 'Correo', minWidth: 140, flex: 1.2, secondary: true },
  { key: 'direccion_proveedor', label: 'Dirección', minWidth: 140, flex: 1.2, secondary: true, words: 3 },
];

export default function ProveedorTable({ proveedores, onView, onEdit, onDelete }) {
  const actions = (proveedor) => [
    { key: 'view', label: 'Ver proveedor', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(proveedor) },
    { key: 'edit', label: 'Editar proveedor', shortLabel: 'Editar', icon: 'edit', onPress: () => onEdit && onEdit(proveedor) },
    { key: 'delete', label: 'Eliminar proveedor', shortLabel: 'Eliminar', icon: 'trash', variant: 'danger', onPress: () => onDelete && onDelete(proveedor) },
  ];

  return (
    <ResponsiveCrudTable
      rows={proveedores}
      columns={columns}
      rowKey={(p) => p.id_proveedor}
      actions={actions}
      actionCount={3}
      emptyMessage="No se encontraron proveedores."
    />
  );
}
