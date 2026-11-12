import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { colors } from '../../../utils/theme';

export default function ProveedorViewModal({ visible, proveedor, onClose }) {
  if (!proveedor) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle del Proveedor</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.titleWrapper}>
              <Text style={styles.providerNameTitle}>{proveedor.nombre_proveedor}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{proveedor.tipo_id}{proveedor.id_proveedor}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Teléfono de Contacto:</Text>
              <Text style={styles.detailValue}>{proveedor.tlf_proveedor}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Correo Electrónico:</Text>
              <Text style={styles.detailValue}>{proveedor.email_proveedor}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Dirección:</Text>
              <Text style={styles.detailValue}>{proveedor.direccion_proveedor}</Text>
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
  titleWrapper: { alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16 },
  providerNameTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 6, textAlign: 'center' },
  badge: { backgroundColor: colors.red, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
  detailItem: { marginBottom: 8 },
  detailLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', marginBottom: 2 },
  detailValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  modalCloseBtn: { backgroundColor: colors.red, marginTop: 16, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalCloseText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});