import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';
import { money } from '../../../utils/format';

export default function PedidoTable({ pedidos, onView, onEdit, onDelete }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colId]}>ID</Text>
        <Text style={[styles.th, styles.colClient]}>Cliente</Text>
        <Text style={[styles.th, styles.colProd]}>Producto</Text>
        <Text style={[styles.th, styles.colTotal]}>Total</Text>
        <Text style={[styles.th, styles.colPay]}>Pago</Text>
        <Text style={[styles.th, styles.colStatus]}>Estado</Text>
        <Text style={[styles.th, styles.colDate]}>Fecha</Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {pedidos.map((p, index) => {
        const isEven = index % 2 === 0;
        return (
          <View key={p.id_pedido} style={[styles.tableRow, isEven && styles.rowEven]}>
            <Text style={[styles.td, styles.colId, styles.textBold]}>#{p.id_pedido}</Text>
            <Text style={[styles.td, styles.colClient]} numberOfLines={1}>{p.nombre_cliente}</Text>
            
            {/* Producto recortado con puntos suspensivos */}
            <Text style={[styles.td, styles.colProd]} numberOfLines={1} ellipsizeMode="tail">
              {p.productos} (x{p.cantidades})
            </Text>

            <Text style={[styles.td, styles.colTotal, styles.priceText]} numberOfLines={1}>{money(p.monto_total_pedido)}</Text>
            <Text style={[styles.td, styles.colPay, { color: '#fbbf24' }]} numberOfLines={1}>{p.pago}</Text>
            <View style={[styles.td, styles.colStatus]}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{p.nombre_estado}</Text>
              </View>
            </View>
            <Text style={[styles.td, styles.colDate]} numberOfLines={1}>{String(p.fecha_pedido).split(' ')[0]}</Text>

            <View style={[styles.td, styles.colActions, styles.actionsRow]}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnView]} onPress={() => onView && onView(p)}>
                <Text style={styles.actionText}>👁️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnEdit]} onPress={() => onEdit && onEdit(p)}>
                <Text style={styles.actionText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnDelete]} onPress={() => onDelete && onDelete(p)}>
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
  table: { backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, minWidth: 980, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8, paddingHorizontal: 8 },
  rowEven: { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  th: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  td: { color: colors.text, fontSize: 13 },
  textBold: { fontWeight: '700' },
  priceText: { color: '#facc15', fontWeight: '800' },
  colId: { width: 60 },
  colClient: { width: 130 },
  colProd: { flex: 2, Width: 90, paddingRight: 10 },
  colTotal: { width: 90 },
  colPay: { width: 90 },
  colStatus: { width: 90, alignItems: 'center' },
  colDate: { width: 90 },
  colActions: { width: 130, alignItems: 'center' },
  actionsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  badge: { backgroundColor: colors.red, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
  actionBtn: { width: 28, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  btnView: { backgroundColor: '#334155' },
  btnEdit: { backgroundColor: '#d97706' },
  btnDelete: { backgroundColor: '#b91c1c' },
  actionText: { fontSize: 12 },
});