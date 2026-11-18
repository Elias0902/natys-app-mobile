import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';
import { BASE_URL } from '../../../utils/config';
import { colors } from '../../../utils/theme';

const columns = (serverRoot) => {
  const imageUrl = (producto) => {
    const raw = producto.imagen || producto.img || '';
    return raw ? `${serverRoot}/${String(raw).replace(/^\/+/, '')}` : null;
  };

  return [
    { key: 'imagen', label: 'Imagen', kind: 'image', minWidth: 50, secondary: true, cardHidden: true, value: imageUrl, fallback: '🍪' },
    { key: 'nombre_producto', label: 'Nombre del Producto', minWidth: 150, flex: 1.5, primary: true, title: true, numberOfLines: 1, words: 3, textStyle: { fontWeight: '700' } },
    { key: 'nombre_categoria', label: 'Categoría', minWidth: 120, flex: 1.2, primary: true },
    { key: 'precio_venta', label: 'Precio', kind: 'money', minWidth: 90, primary: true },
    {
      key: 'stock',
      label: 'Stock',
      minWidth: 60,
      primary: true,
      value: (p) => p.stock,
      textStyle: (p) => ({ textAlign: 'center', color: p.stock <= 50 ? '#f87171' : colors.text, fontWeight: '700' }),
    },
  ];
};

export default function ProductoTable({ productos, onAdd, onView, onEdit, onDelete }) {
  const serverRoot = BASE_URL.replace('/api', '');
  const actions = (producto) => [
    ...(onAdd ? [{
      key: 'add',
      label: 'Añadir al carrito',
      shortLabel: 'Añadir',
      icon: 'cart',
      variant: 'primary',
      disabled: producto.stock <= 0,
      onPress: () => onAdd(producto),
    }] : []),
    { key: 'view', label: 'Ver producto', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(producto) },
    { key: 'edit', label: 'Editar producto', shortLabel: 'Editar', icon: 'edit', onPress: () => onEdit && onEdit(producto) },
    { key: 'delete', label: 'Eliminar producto', shortLabel: 'Eliminar', icon: 'trash', variant: 'danger', onPress: () => onDelete && onDelete(producto) },
  ];

  return (
    <ResponsiveCrudTable
      rows={productos}
      columns={columns(serverRoot)}
      rowKey={(p) => p.id_producto}
      actions={actions}
      actionCount={onAdd ? 4 : 3}
      emptyMessage="No se encontraron productos."
    />
  );
}
