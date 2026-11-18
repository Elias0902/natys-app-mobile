import React from 'react';
import ResponsiveCrudTable from '../../../components/ResponsiveCrudTable';

const isPaid = (cuenta) => cuenta.estado_pago === 'Pagado' || Number(cuenta.saldo_pendiente) === 0;

const columns = [
  { key: 'id_cuenta_x_pagar', label: 'ID', kind: 'id', minWidth: 50, primary: true, title: true },
  { key: 'id_compra', label: 'Compra', kind: 'id', minWidth: 65, secondary: true },
  { key: 'nombre_proveedor', label: 'Proveedor', minWidth: 160, flex: 2, primary: true, textStyle: { fontWeight: '700' } },
  {
    key: 'monto_total',
    label: 'Monto Total',
    minWidth: 95,
    primary: true,
    value: (c) => `$${c.monto_total}`,
    textStyle: { textAlign: 'right', color: '#fbbf24', fontWeight: '700' },
  },
  {
    key: 'saldo_pendiente',
    label: 'Saldo Pend.',
    minWidth: 95,
    primary: true,
    value: (c) => `$${c.saldo_pendiente}`,
    textStyle: (c) => ({ textAlign: 'right', color: Number(c.saldo_pendiente) > 0 ? '#f87171' : '#34d399', fontWeight: '700' }),
  },
  { key: 'fecha_emision', label: 'Emisión', kind: 'date', minWidth: 100, secondary: true, value: (c) => (c.fecha_emision ? c.fecha_emision.split(' ')[0] : '') },
  { key: 'fecha_vencimiento', label: 'Vencimiento', kind: 'date', minWidth: 100, secondary: true, value: (c) => (c.fecha_vencimiento ? c.fecha_vencimiento.split(' ')[0] : '') },
  {
    key: 'estado_pago',
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

export default function CuentaPagarTable({ cuentas, onView, onAbonar }) {
  const actions = (cuenta) => [
    { key: 'view', label: 'Ver cuenta', shortLabel: 'Ver', icon: 'eye', onPress: () => onView && onView(cuenta) },
    { key: 'abonar', label: 'Abonar cuenta', shortLabel: 'Abonar', icon: 'dollar', variant: 'success', onPress: () => onAbonar && onAbonar(cuenta) },
  ];

  return (
    <ResponsiveCrudTable
      rows={cuentas}
      columns={columns}
      rowKey={(c) => c.id_cuenta_x_pagar}
      actions={actions}
      actionCount={2}
      emptyMessage="No se encontraron cuentas por pagar."
    />
  );
}
