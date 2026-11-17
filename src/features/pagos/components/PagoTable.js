import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';

export default function PagoTable({ pagos, onView }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colId]}>ID</Text>
        <Text style={[styles.th, styles.colName]}>Entidad</Text>
        <Text style={[styles.th, styles.colConcept]}>Concepto</Text>
        <Text style={[styles.th, styles.colRef]}>Nro. Referencia</Text>
        <Text style={[styles.th, styles.colMethod]}>Método</Text>
        <Text style={[styles.th, styles.colAmount]}>Monto</Text>
        <Text style={[styles.th, styles.colStatus]}>Estado</Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {pagos.map((item, index) => {
        const idPago = item.id_pago || item.id_pago_proveedor;
        const monto = item.monto_pago || item.monto;
        const isPaid = item.id_estado_pago === 2;

        return (
          <View key={idPago} style={[styles.tableRow, index % 2 === 0 && styles.rowEven]}>
            <Text style={[styles.td, styles.colId, styles.textBold]}>#{idPago}</Text>
            <Text style={[styles.td, styles.colName, styles.textBold]} numberOfLines={1}>{item.nombre}</Text>
            <Text style={[styles.td, styles.colConcept]} numberOfLines={1}>{item.concepto}</Text>
            <Text style={[styles.td, styles.colRef]} numberOfLines={1}>{item.nro_referencia}</Text>
            <Text style={[styles.td, styles.colMethod]} numberOfLines={1}>{item.nombre_metodo}</Text>
            <Text style={[styles.td, styles.colAmount, styles.amountText]} numberOfLines={1}>${monto}</Text>
            <View style={[styles.td, styles.colStatus]}>
              <View style={[styles.badge, { backgroundColor: isPaid ? '#16a34a' : '#d97706' }]}>
                <Text style={styles.badgeText}>{item.nombre_estado}</Text>
              </View>
            </View>
            <View style={[styles.td, styles.colActions, styles.actionsRow]}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnView]} onPress={() => onView && onView(item)}>
                <Text style={styles.actionText}>👁️</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, minWidth: 950, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8, paddingHorizontal: 8 },
  rowEven: { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  th: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  td: { color: colors.text, fontSize: 13 },
  textBold: { fontWeight: '700' },
  amountText: { color: '#facc15', fontWeight: '800' },
  colId: { width: 60 },
  colName: { flex: 1.5, minWidth: 160 },
  colConcept: { flex: 1.2, minWidth: 130 },
  colRef: { width: 130 },
  colMethod: { width: 120 },
  colAmount: { width: 90 },
  colStatus: { width: 100, alignItems: 'center' },
  colActions: { width: 90, alignItems: 'center' },
  actionsRow: { flexDirection: 'row', justifyContent: 'center' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
  actionBtn: { width: 28, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  btnView: { backgroundColor: '#334155' },
  actionText: { fontSize: 12 },
});