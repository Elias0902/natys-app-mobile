import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';

export default function ProveedorTable({ proveedores, onView, onEdit, onDelete }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colId]}>RIF / ID</Text>
        <Text style={[styles.th, styles.colName]}>Nombre Proveedor</Text>
        <Text style={[styles.th, styles.colPhone]}>Teléfono</Text>
        <Text style={[styles.th, styles.colEmail]}>Correo</Text>
        <Text style={[styles.th, styles.colAddress]}>Dirección</Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {proveedores.map((p, index) => {
        const isEven = index % 2 === 0;
        return (
          <View key={p.id_proveedor} style={[styles.tableRow, isEven && styles.rowEven]}>
            <Text style={[styles.td, styles.colId]} numberOfLines={1}>{p.tipo_id}{p.id_proveedor}</Text>
            <Text style={[styles.td, styles.colName, styles.textBold]} numberOfLines={1}>{p.nombre_proveedor}</Text>
            <Text style={[styles.td, styles.colPhone]} numberOfLines={1}>{p.tlf_proveedor}</Text>
            <Text style={[styles.td, styles.colEmail]} numberOfLines={1}>{p.email_proveedor}</Text>
            <Text style={[styles.td, styles.colAddress]} numberOfLines={2}>{p.direccion_proveedor}</Text>
            
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
  table: { backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, minWidth: 900, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 8 },
  rowEven: { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  th: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  td: { color: colors.text, fontSize: 13 },
  textBold: { fontWeight: '700' },
  colId: { width: 110 },
  colName: { flex: 1.5, minWidth: 150 },
  colPhone: { width: 120 },
  colEmail: { flex: 1.2, minWidth: 140 },
  colAddress: { flex: 2, minWidth: 180 },
  colActions: { width: 130, alignItems: 'center' },
  actionsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  actionBtn: { width: 28, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  btnView: { backgroundColor: '#334155' },
  btnEdit: { backgroundColor: '#d97706' },
  btnDelete: { backgroundColor: '#b91c1c' },
  actionText: { fontSize: 12 },
});