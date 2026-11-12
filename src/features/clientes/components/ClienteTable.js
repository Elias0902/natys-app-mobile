import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';
import { BASE_URL } from '../../../utils/config';

export default function ClienteTable({ clientes, onView, onEdit, onDelete }) {
  const serverRoot = BASE_URL.replace('/api', '');

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colAvatar]}></Text>
        <Text style={[styles.th, styles.colId]}>Cédula / RIF</Text>
        <Text style={[styles.th, styles.colName]}>Nombre</Text>
        <Text style={[styles.th, styles.colType]}>Tipo</Text>
        <Text style={[styles.th, styles.colSector]}>Sector</Text>
        <Text style={[styles.th, styles.colPhone]}>Teléfono</Text>
        <Text style={[styles.th, styles.colCredito]}>Crédito</Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {clientes.map((c, index) => {
        const rawImg = c.img_cliente || '';
        const imageUrl = rawImg ? `${serverRoot}/${rawImg.replace(/^\/+/, '')}` : null;
        const isEven = index % 2 === 0;

        return (
          <View key={c.id_cliente} style={[styles.tableRow, isEven && styles.rowEven]}>
            <View style={[styles.td, styles.colAvatar]}>
              <View style={styles.avatarContainer}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.avatar} resizeMode="cover" />
                ) : (
                  <Text style={styles.avatarFallback}>👤</Text>
                )}
              </View>
            </View>
            <Text style={[styles.td, styles.colId]} numberOfLines={1}>{c.tipo_id}-{c.id_cliente}</Text>
            <Text style={[styles.td, styles.colName, styles.textBold]} numberOfLines={1}>{c.nombre_cliente}</Text>
            <Text style={[styles.td, styles.colType]} numberOfLines={1}>{c.nombre_tipo_cliente}</Text>
            <Text style={[styles.td, styles.colSector]} numberOfLines={1}>{c.sector}</Text>
            <Text style={[styles.td, styles.colPhone]} numberOfLines={1}>{c.tlf_cliente}</Text>
            <Text style={[styles.td, styles.colCredito, styles.textAccent]} numberOfLines={1}>{c.dias_credito} días</Text>
            
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
  table: { backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, minWidth: 900, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8, paddingHorizontal: 8 },
  rowEven: { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  th: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  td: { color: colors.text, fontSize: 13 },
  textBold: { fontWeight: '700' },
  textAccent: { color: '#fbbf24', fontWeight: '700' },
  colAvatar: { width: 45, alignItems: 'center' },
  colId: { width: 110 },
  colName: { flex: 2, minWidth: 160 },
  colType: { flex: 1.2, minWidth: 120 },
  colSector: { width: 100 },
  colPhone: { width: 120 },
  colCredito: { width: 80, textAlign: 'right' },
  colActions: { width: 130, alignItems: 'center' },
  actionsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  actionBtn: { width: 28, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  btnView: { backgroundColor: '#334155' },
  btnEdit: { backgroundColor: '#d97706' },
  btnDelete: { backgroundColor: '#b91c1c' },
  actionText: { fontSize: 12 },
  avatarContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  avatar: { width: '100%', height: '100%' },
  avatarFallback: { fontSize: 14 },
});