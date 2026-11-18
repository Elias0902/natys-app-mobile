import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';
import { BASE_URL } from '../../../utils/config';

const columns = (serverRoot) => {
  const imageUrl = (cliente) => {
    const raw = cliente.img_cliente || '';
    return raw ? `${serverRoot}/${String(raw).replace(/^\/+/, '')}` : null;
  };

  return [
    { key: 'img_cliente', label: 'Foto', kind: 'avatar', minWidth: 48, secondary: true, cardHidden: true, value: imageUrl, fallback: '👤' },
    {
      key: 'id_cliente',
      label: 'Cédula / RIF',
      kind: 'id',
      prefix: '',
      minWidth: 110,
      primary: true,
      title: true,
      value: (c) => (c.tipo_id ? `${c.tipo_id}-${c.id_cliente}` : c.id_cliente),
    },
    { key: 'nombre_cliente', label: 'Nombre', minWidth: 160, flex: 2, primary: true, textStyle: { fontWeight: '700' } },
    { key: 'nombre_tipo_cliente', label: 'Tipo', minWidth: 120, secondary: true },
    { key: 'sector', label: 'Sector', minWidth: 100, secondary: true },
    { key: 'tlf_cliente', label: 'Teléfono', minWidth: 120, primary: true },
    {
      key: 'dias_credito',
      label: 'Crédito',
      minWidth: 90,
      secondary: true,
      value: (c) => (c.dias_credito ? `${c.dias_credito} días` : ''),
      textStyle: { color: '#fbbf24', fontWeight: '700' },
    },
  ];
};

export default function ClienteTable({ clientes, onView, onEdit, onDelete }) {
  const serverRoot = BASE_URL.replace('/api', '');
  const actions = (cliente) => [
    { key: 'view', label: 'Ver cliente', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(cliente) },
    { key: 'edit', label: 'Editar cliente', shortLabel: 'Editar', icon: 'edit', onPress: () => onEdit && onEdit(cliente) },
    { key: 'delete', label: 'Eliminar cliente', shortLabel: 'Eliminar', icon: 'trash', variant: 'danger', onPress: () => onDelete && onDelete(cliente) },
  ];

  return (
    <ResponsiveCrudTable
      rows={clientes}
      columns={columns(serverRoot)}
      rowKey={(c) => c.id_cliente}
      actions={actions}
      actionCount={3}
      emptyMessage="No se encontraron clientes."
    />
  );
}
