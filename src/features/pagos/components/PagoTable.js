import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';

const idOf = (pago) => pago.id_pago || pago.id_pago_proveedor;
const amountOf = (pago) => pago.monto_pago || pago.monto;
const isPaid = (pago) => pago.id_estado_pago === 2;

const columns = [
  { key: 'id_pago', label: 'ID', kind: 'id', minWidth: 60, primary: true, title: true, value: idOf },
  { key: 'nombre', label: 'Entidad', minWidth: 160, flex: 1.5, primary: true, textStyle: { fontWeight: '700' } },
  { key: 'concepto', label: 'Concepto', minWidth: 110, flex: 1.2, secondary: true, words: 3 },
  { key: 'nro_referencia', label: 'Nro. Referencia', minWidth: 130, secondary: true },
  { key: 'nombre_metodo', label: 'Método', minWidth: 120, secondary: true },
  {
    key: 'monto_pago',
    label: 'Monto',
    minWidth: 90,
    primary: true,
    value: (pago) => `$${amountOf(pago)}`,
    textStyle: { color: '#facc15', fontWeight: '800' },
  },
  {
    key: 'nombre_estado',
    label: 'Estado',
    kind: 'status',
    minWidth: 100,
    primary: true,
    tone: (pago) => ({ bg: isPaid(pago) ? '#16a34a' : '#d97706', fg: '#fff' }),
  },
];

// Los pagos son solo consultables: no se registra, edita ni elimina desde este módulo.
export default function PagoTable({ pagos, onView }) {
  const actions = (pago) => [
    { key: 'view', label: 'Ver pago', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(pago) },
  ];

  return (
    <ResponsiveCrudTable
      rows={pagos}
      columns={columns}
      rowKey={(pago) => idOf(pago)}
      actions={actions}
      actionCount={1}
      emptyMessage="No se encontraron registros de pago."
    />
  );
}
