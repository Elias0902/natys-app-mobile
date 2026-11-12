import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { colors } from '../../../utils/theme';

export default function CompraViewModal({ visible, compra, onClose }) {
  if (!compra) return null;

  const cleanHtmlText = (text) => {
    if (!text) return '';
    return String(text).replace(/<br\s*[\/]?>/gi, '\n');
  };

  const isPagado = compra.id_estado_pago === 2 || compra.pago === 'Pagado';

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle de la Compra #{compra.id_compra}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Proveedor:</Text>
              <Text style={styles.detailValue}>{compra.tipo_id}{compra.id_proveedor} - {compra.nombre_proveedor}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Fecha de Compra:</Text>
              <Text style={styles.detailValue}>{compra.fecha_compra}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Materia Prima:</Text>
              <Text style={styles.detailValue}>{cleanHtmlText(compra.materiaPrima)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cantidades:</Text>
              <Text style={styles.detailValue}>{cleanHtmlText(compra.cantidades)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Monto Total:</Text>
              <Text style={[styles.detailValue, { color: '#fbbf24', fontWeight: 'bold' }]}>${compra.monto_total_compra}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Tasa Aplicada:</Text>
              <Text style={styles.detailValue}>{compra.monto_tasa} VES (ID Tasa: {compra.id_tasa})</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Estado de Pago:</Text>
              <Text style={[styles.detailValue, { color: isPagado ? '#34d399' : '#f87171', fontWeight: 'bold' }]}>{compra.pago}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Observaciones:</Text>
              <Text style={styles.detailValue}>{compra.observaciones || 'Sin observaciones'}</Text>
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
  detailItem: { marginBottom: 6 },
  detailLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', marginBottom: 2 },
  detailValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  modalCloseBtn: { backgroundColor: colors.red, marginTop: 16, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalCloseText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});