import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';

export default function PromocionTable({ promociones, onView, onEdit, onDelete }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colId]}></Text>
        <Text style={[styles.th, styles.colName]}>Nombre de Promoción</Text>
        <Text style={[styles.th, styles.colDesc]}></Text>
        <Text style={[styles.th, styles.colType]}></Text>
        <Text style={[styles.th, styles.colDates]}></Text>
        <Text style={[styles.th, styles.colStatus]}></Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {promociones.map((p, index) => {
        const isActive = p.estado === 1 || p.status === 1;
        return (
          <View key={p.id_promocion} style={[styles.tableRow, index % 2 === 0 && styles.rowEven]}>
            <Text style={[styles.td, styles.colId, styles.textBold]}>#{p.id_promocion}</Text>
            <Text style={[styles.td, styles.colName, styles.textBold]} numberOfLines={1}>{p.nombre_promocion}</Text>
            <Text style={[styles.td, styles.colDesc]} numberOfLines={1}>{p.descripcion_promocion}</Text>
            <Text style={[styles.td, styles.colType]} numberOfLines={1}>{p.tipo_descuento} ({p.valor_descuento})</Text>
            <Text style={[styles.td, styles.colDates]} numberOfLines={1}>{p.fecha_inicio} al {p.fecha_fin}</Text>
            <View style={[styles.td, styles.colStatus]}>
              <View style={[styles.badge, { backgroundColor: isActive ? '#16a34a' : '#b91c1c' }]}>
                <Text style={styles.badgeText}>{isActive ? 'Activa' : 'Inactiva'}</Text>
              </View>
            </View>
            <View style={[styles.td, styles.colActions, styles.actionsRow]}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnView]} onPress={() => onView(p)}>
                <Text style={styles.actionText}>👁️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnEdit]} onPress={() => onEdit(p)}>
                <Text style={styles.actionText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.btnDelete]} onPress={() => onDelete(p)}>
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
  table: { backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, minWidth: 950, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8, paddingHorizontal: 8 },
  rowEven: { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  th: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  td: { color: colors.text, fontSize: 13 },
  textBold: { fontWeight: '700' },
  colId: { width: 60 },
  colName: { flex: 1.5, minWidth: 160 },
  colDesc: { flex: 2, minWidth: 180 },
  colType: { width: 120 },
  colDates: { width: 170 },
  colStatus: { width: 90, alignItems: 'center' },
  colActions: { width: 130, alignItems: 'center' },
  actionsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
  actionBtn: { width: 28, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  btnView: { backgroundColor: '#334155' },
  btnEdit: { backgroundColor: '#d97706' },
  btnDelete: { backgroundColor: '#b91c1c' },
  actionText: { fontSize: 12 },
});