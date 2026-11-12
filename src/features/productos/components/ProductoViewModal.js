import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { colors } from '../../../utils/theme';
import { BASE_URL } from '../../../utils/config';
import { money } from '../../../utils/format';

export default function ProductoViewModal({ visible, producto, onClose }) {
  if (!producto) return null;

  const serverRoot = BASE_URL.replace('/api', '');
  const rawImg = producto.imagen || producto.img || '';
  const imageUrl = rawImg ? `${serverRoot}/${rawImg.replace(/^\/+/, '')}` : null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle del Producto</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.imageWrapper}>
              <View style={styles.imageContainer}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
                ) : (
                  <Text style={styles.imageFallback}>🍪</Text>
                )}
              </View>
              <Text style={styles.productNameTitle}>{producto.nombre_producto}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{producto.nombre_categoria}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Precio de Venta:</Text>
              <Text style={[styles.detailValue, { color: '#facc15', fontWeight: 'bold', fontSize: 16 }]}>{money(producto.precio_venta)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Stock Disponible:</Text>
              <Text style={[styles.detailValue, producto.stock <= 50 && styles.lowStock]} fontSize={14}>
                {producto.stock} unidades
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Text style={styles.modalCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: colors.card, width: '100%', maxWidth: 500, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 18, color: colors.muted, fontWeight: 'bold' },
  modalBody: { gap: 10 },
  imageWrapper: { alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16 },
  imageContainer: { width: 100, height: 100, borderRadius: 8, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  image: { width: '100%', height: '100%' },
  imageFallback: { fontSize: 40 },
  productNameTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 6, textAlign: 'center' },
  badge: { backgroundColor: colors.red, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
  detailItem: { marginBottom: 8 },
  detailLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', marginBottom: 2 },
  detailValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  lowStock: { color: '#f87171', fontWeight: 'bold' },
  modalCloseBtn: { backgroundColor: colors.red, marginTop: 16, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalCloseText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});