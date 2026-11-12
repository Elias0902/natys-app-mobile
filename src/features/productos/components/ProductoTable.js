import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../../utils/theme';
import { BASE_URL } from '../../../utils/config';
import { money } from '../../../utils/format';

export default function ProductoTable({ productos, onAdd, onView, onEdit, onDelete }) {
  const serverRoot = BASE_URL.replace('/api', '');

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.th, styles.colImg]}></Text>
        <Text style={[styles.th, styles.colName]}>Nombre del Producto</Text>
        <Text style={[styles.th, styles.colCat]}>Categoría</Text>
        <Text style={[styles.th, styles.colPrice]}>Precio</Text>
        <Text style={[styles.th, styles.colStock]}>Stock</Text>
        <Text style={[styles.th, styles.colBuyAction]}></Text>
        <Text style={[styles.th, styles.colActions]}>Acciones</Text>
      </View>

      {productos.map((p, index) => {
        const rawImg = p.imagen || p.img || '';
        const imageUrl = rawImg ? `${serverRoot}/${rawImg.replace(/^\/+/, '')}` : null;
        const isEven = index % 2 === 0;

        return (
          <View key={p.id_producto} style={[styles.tableRow, isEven && styles.rowEven]}>
            <View style={[styles.td, styles.colImg]}>
              <View style={styles.imgContainer}>
                {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.img} resizeMode="contain" /> : <Text style={styles.fallback}>🍪</Text>}
              </View>
            </View>
            <Text style={[styles.td, styles.colName, styles.textBold]} numberOfLines={2}>{p.nombre_producto}</Text>
            <Text style={[styles.td, styles.colCat]} numberOfLines={1}>{p.nombre_categoria}</Text>
            <Text style={[styles.td, styles.colPrice, styles.priceText]} numberOfLines={1}>{money(p.precio_venta)}</Text>
            <Text style={[styles.td, styles.colStock, p.stock <= 50 && styles.lowStock]} numberOfLines={1}>{p.stock}</Text>
            
            <View style={[styles.td, styles.colBuyAction]}>
              {onAdd && (
                <TouchableOpacity 
                  style={[styles.btnCart, p.stock <= 0 && styles.btnDisabled]} 
                  onPress={() => onAdd(p)}
                  disabled={p.stock <= 0}
                >
                  <Text style={styles.btnCartText}>{p.stock > 0 ? '🛒' : '🚫'}</Text>
                </TouchableOpacity>
              )}
            </View>

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
  table: { backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, minWidth: 950, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8, paddingHorizontal: 8 },
  rowEven: { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  th: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  td: { color: colors.text, fontSize: 13 },
  textBold: { fontWeight: '700' },
  priceText: { color: '#facc15', fontWeight: '800' },
  lowStock: { color: '#f87171', fontWeight: 'bold' },
  colImg: { width: 50, alignItems: 'center' },
  colName: { flex: 2, minWidth: 180 },
  colCat: { flex: 1.2, minWidth: 120 },
  colPrice: { width: 90 },
  colStock: { width: 60, textAlign: 'center' },
  colBuyAction: { width: 45, alignItems: 'center' },
  colActions: { width: 130, alignItems: 'center' },
  actionsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  imgContainer: { width: 36, height: 36, backgroundColor: '#0f172a', borderRadius: 4, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  fallback: { fontSize: 16 },
  btnCart: { backgroundColor: colors.red, width: 28, height: 28, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  btnDisabled: { backgroundColor: '#475569' },
  btnCartText: { color: '#ffffff', fontSize: 12 },
  actionBtn: { width: 28, height: 28, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  btnView: { backgroundColor: '#334155' },
  btnEdit: { backgroundColor: '#d97706' },
  btnDelete: { backgroundColor: '#b91c1c' },
  actionText: { fontSize: 12 },
});