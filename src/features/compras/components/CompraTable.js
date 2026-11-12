import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';

export default function CompraTable({ compras, onView, onEdit, onDelete }) {
  // Función auxiliar para limpiar tags HTML como <br> que vengan en la respuesta
  const cleanHtmlText = (text) => {
    if (!text) return '';
    return String(text).replace(/<br\s*[\/]?>/gi, ' - ');
  };

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colId]}>ID</Text>
        <Text style={[styles.th, styles.colProveedor]}>Proveedor</Text>
        <Text style={[styles.th, styles.colFecha]}>Fecha</Text>
        <Text style={[styles.th, styles.colMateria]}>Materia Prima</Text>
        <Text style={[styles.th, styles.colMonto]}>Monto ($)</Text>
        <Text style={[styles.th, styles.colEstado]}>Estado</Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {compras.map((c, index) => {
        const isEven = index % 2 === 0;
        const isPagado = c.id_estado_pago === 2 || c.pago === 'Pagado';

        return (
          <View key={c.id_compra} style={[styles.tableRow, isEven && styles.rowEven]}>
            <Text style={[styles.td, styles.colId]} numberOfLines={1}>#{c.id_compra}</Text>
            <Text style={[styles.td, styles.colProveedor, styles.textBold]} numberOfLines={1}>{c.nombre_proveedor}</Text>
            <Text style={[styles.td, styles.colFecha]} numberOfLines={1}>{c.fecha_compra ? c.fecha_compra.split(' ')[0] : ''}</Text>
            <Text style={[styles.td, styles.colMateria]} numberOfLines={1}>{cleanHtmlText(c.materiaPrima)}</Text>
            <Text style={[styles.td, styles.colMonto, styles.textAccent]} numberOfLines={1}>${c.monto_total_compra}</Text>
            
            <View style={[styles.td, styles.colEstado]}>
              <View style={[styles.badge, isPagado ? styles.badgePagado : styles.badgePorPagar]}>
                <Text style={styles.badgeText}>{c.pago}</Text>
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
  table: { backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, minWidth: 950, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8, paddingHorizontal: 8 },
  rowEven: { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  th: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  td: { color: colors.text, fontSize: 13 },
  textBold: { fontWeight: '700' },
  textAccent: { color: '#fbbf24', fontWeight: '700' },
  colId: { width: 60 },
  colProveedor: { flex: 2, minWidth: 160 },
  colFecha: { width: 100 },
  colMateria: { flex: 2, minWidth: 180 },
  colMonto: { width: 90, textAlign: 'right' },
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
  badgePorPagar: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
});