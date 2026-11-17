import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';

export default function EntregaTable({ entregas, onView, onEdit, onDelete }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colId]}>ID</Text>
        <Text style={[styles.th, styles.colClient]}>Cliente</Text>
        <Text style={[styles.th, styles.colTruck]}>Camión</Text>
        <Text style={[styles.th, styles.colDriver]}>Repartidor</Text>
        <Text style={[styles.th, styles.colDate]}>Fecha Prog.</Text>
        <Text style={[styles.th, styles.colStatus]}>Estado</Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {entregas.map((e, index) => {
        const isEven = index % 2 === 0;
        return (
          <View key={e.id_entregas} style={[styles.tableRow, isEven && styles.rowEven]}>
            <Text style={[styles.td, styles.colId, styles.textBold]}>#{e.id_entregas}</Text>
            <Text style={[styles.td, styles.colClient]} numberOfLines={1}>{e.cliente_nombre}</Text>
            <Text style={[styles.td, styles.colTruck]} numberOfLines={1}>{e.camion_placa} ({e.camion_modelo})</Text>
            <Text style={[styles.td, styles.colDriver]} numberOfLines={1}>{e.repartidor}</Text>
            <Text style={[styles.td, styles.colDate]} numberOfLines={1}>{e.fecha_programada}</Text>
            <View style={[styles.td, styles.colStatus]}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{e.estado}</Text>
              </View>
            </View>

            <View style={[styles.td, styles.colActions, styles.actionsRow]}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnView]} onPress={() => onView && onView(e)}>
                <Text style={styles.actionText}>👁️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnEdit]} onPress={() => onEdit && onEdit(e)}>
                <Text style={styles.actionText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnDelete]} onPress={() => onDelete && onDelete(e)}>
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
  colId: { width: 60 },
  colClient: { flex: 1.5, minWidth: 150 },
  colTruck: { flex: 1.2, minWidth: 140 },
  colDriver: { flex: 1.2, minWidth: 130 },
  colDate: { width: 100 },
  colStatus: { width: 100, alignItems: 'center' },
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