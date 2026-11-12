import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';

export default function CuentaCobrarTable({ cuentas, onView, onEdit, onDelete }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colId]}>ID</Text>
        <Text style={[styles.th, styles.colPedido]}>Pedido</Text>
        <Text style={[styles.th, styles.colCliente]}>Cliente</Text>
        <Text style={[styles.th, styles.colMonto]}>Monto Total</Text>
        <Text style={[styles.th, styles.colSaldo]}>Saldo Pend.</Text>
        <Text style={[styles.th, styles.colEmision]}>Emisión</Text>
        <Text style={[styles.th, styles.colVencimiento]}>Vencimiento</Text>
        <Text style={[styles.th, styles.colEstado]}>Estado</Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {cuentas.map((c, index) => {
        const isEven = index % 2 === 0;
        const isPagado = c.estado_cuenta === 'Pagado' || Number(c.saldo_pendiente) === 0;

        return (
          <View key={c.id_cuenta_x_cobrar} style={[styles.tableRow, isEven && styles.rowEven]}>
            <Text style={[styles.td, styles.colId]} numberOfLines={1}>#{c.id_cuenta_x_cobrar}</Text>
            <Text style={[styles.td, styles.colPedido]} numberOfLines={1}>#{c.id_pedido}</Text>
            <Text style={[styles.td, styles.colCliente, styles.textBold]} numberOfLines={1}>{c.nombre_cliente}</Text>
            <Text style={[styles.td, styles.colMonto, styles.textAccent]} numberOfLines={1}>${c.monto_total}</Text>
            <Text style={[styles.td, styles.colSaldo, Number(c.saldo_pendiente) > 0 ? styles.textDanger : styles.textSuccess]} numberOfLines={1}>${c.saldo_pendiente}</Text>
            <Text style={[styles.td, styles.colEmision]} numberOfLines={1}>{c.fecha_emision}</Text>
            <Text style={[styles.td, styles.colVencimiento]} numberOfLines={1}>{c.fecha_vencimiento}</Text>
            
            <View style={[styles.td, styles.colEstado]}>
              <View style={[styles.badge, isPagado ? styles.badgePagado : styles.badgePendiente]}>
                <Text style={styles.badgeText}>{c.estado_cuenta}</Text>
              </View>
            </View>

            <View style={[styles.td, styles.colActions, styles.actionsRow]}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnView]} onPress={() => onView && onView(c)}>
                <Text style={styles.actionText}>👁️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnEdit]} onPress={() => onEdit && onEdit(c)}>
                <Text style={styles.actionText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnDelete]} onPress={() => onDelete && onDelete(c)}>
                <Text style={styles.actionText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, minWidth: 1050, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8, paddingHorizontal: 8 },
  rowEven: { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  th: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  td: { color: colors.text, fontSize: 13 },
  textBold: { fontWeight: '700' },
  textAccent: { color: '#fbbf24', fontWeight: '700' },
  textSuccess: { color: '#34d399', fontWeight: '700' },
  textDanger: { color: '#f87171', fontWeight: '700' },
  colId: { width: 50 },
  colPedido: { width: 65 },
  colCliente: { flex: 2, minWidth: 160 },
  colMonto: { width: 95, textAlign: 'right' },
  colSaldo: { width: 95, textAlign: 'right' },
  colEmision: { width: 100 },
  colVencimiento: { width: 100 },
  colEstado: { width: 100, alignItems: 'center' },
  colActions: { width: 130, alignItems: 'center' },
  actionsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  actionBtn: { width: 28, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  btnView: { backgroundColor: '#334155' },
  btnEdit: { backgroundColor: '#d97706' },
  btnDelete: { backgroundColor: '#b91c1c' },
  actionText: { fontSize: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgePagado: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  badgePendiente: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
});