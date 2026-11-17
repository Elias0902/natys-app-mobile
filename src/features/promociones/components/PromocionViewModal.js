import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { colors } from '../../../utils/theme';

export default function PromocionViewModal({ visible, promocion, onClose }) {
  if (!promocion) return null;

  const isActive = promocion.estado === 1 || promocion.status === 1;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle de Promoción #{promocion.id_promocion}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <Text style={styles.detailLabel}>Nombre de la Promoción:</Text>
            <Text style={styles.detailValue}>{promocion.nombre_promocion}</Text>

            <Text style={styles.detailLabel}>Descripción:</Text>
            <Text style={styles.detailValue}>{promocion.descripcion_promocion}</Text>

            <View style={styles.rowDetails}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Tipo de Descuento:</Text>
                <Text style={styles.detailValue}>{promocion.tipo_descuento}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Valor:</Text>
                <Text style={[styles.detailValue, { color: '#facc15', fontWeight: 'bold' }]}>{promocion.valor_descuento}</Text>
              </View>
            </View>

            <Text style={styles.detailLabel}>Vigencia (Inicio al Fin):</Text>
            <Text style={styles.detailValue}>{promocion.fecha_inicio} al {promocion.fecha_fin}</Text>

            <Text style={styles.detailLabel}>Estado:</Text>
            <View style={[styles.badgeInline, { backgroundColor: isActive ? '#16a34a' : '#b91c1c' }]}>
              <Text style={styles.badgeText}>{isActive ? 'Activa' : 'Inactiva'}</Text>
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
  modalBody: { gap: 8, marginBottom: 16 },
  rowDetails: { flexDirection: 'row', gap: 10 },
  detailLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', marginTop: 4 },
  detailValue: { fontSize: 14, color: colors.text, marginBottom: 4 },
  badgeInline: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginTop: 2 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
  modalCloseBtn: { backgroundColor: colors.red, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalCloseText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});