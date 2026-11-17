import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';

export default function NotificacionTable({ notificaciones, onView }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colId]}>ID</Text>
        <Text style={[styles.th, styles.colTitle]}>Título</Text>
        <Text style={[styles.th, styles.colDesc]}>Descripción</Text>
        <Text style={[styles.th, styles.colDate]}>Fecha</Text>
        <Text style={[styles.th, styles.colType]}>Tipo</Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {notificaciones.map((n, index) => {
        const isEven = index % 2 === 0;
        return (
          <View key={n.id_notificaciones} style={[styles.tableRow, isEven && styles.rowEven]}>
            <Text style={[styles.td, styles.colId, styles.textBold]}>#{n.id_notificaciones}</Text>
            <Text style={[styles.td, styles.colTitle, styles.textBold]} numberOfLines={1}>{n.titulo}</Text>
            <Text style={[styles.td, styles.colDesc]} numberOfLines={1}>{n.descripcion_notificacion}</Text>
            <Text style={[styles.td, styles.colDate]} numberOfLines={1}>{n.fecha_notificacion}</Text>
            <View style={[styles.td, styles.colType]}>
              <View style={[styles.badge, { backgroundColor: n.tipo_notificacion === 'alerta' ? '#b91c1c' : '#334155' }]}>
                <Text style={styles.badgeText}>{n.tipo_notificacion}</Text>
              </View>
            </View>
            <View style={[styles.td, styles.colActions, styles.actionsRow]}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnView]} onPress={() => onView && onView(n)}>
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
  colId: { width: 60 },
  colTitle: { flex: 1.2, minWidth: 150 },
  colDesc: { flex: 2, minWidth: 200 },
  colDate: { width: 150 },
  colType: { width: 90, alignItems: 'center' },
  colActions: { width: 90, alignItems: 'center' },
  actionsRow: { flexDirection: 'row', justifyContent: 'center' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
  actionBtn: { width: 28, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  btnView: { backgroundColor: '#334155' },
  actionText: { fontSize: 12 },
});