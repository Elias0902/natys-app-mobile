import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { colors } from '../../../utils/theme';

export default function CuentaCobrarViewModal({ visible, cuenta, onClose }) {
  if (!cuenta) return null;

  const isPagado = cuenta.estado_cuenta === 'Pagado' || Number(cuenta.saldo_pendiente) === 0;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle Cuenta por Cobrar #{cuenta.id_cuenta_x_cobrar}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cliente:</Text>
              <Text style={styles.detailValue}>{cuenta.tipo_id}-{cuenta.id_cliente} - {cuenta.nombre_cliente}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>ID Pedido Asociado:</Text>
              <Text style={styles.detailValue}>#{cuenta.id_pedido}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Monto Total:</Text>
              <Text style={[styles.detailValue, { color: '#fbbf24', fontWeight: 'bold' }]}>${cuenta.monto_total}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Saldo Pendiente:</Text>
              <Text style={[styles.detailValue, { color: Number(cuenta.saldo_pendiente) > 0 ? '#f87171' : '#34d399', fontWeight: 'bold' }]}>${cuenta.saldo_pendiente}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Fecha de Emisión:</Text>
              <Text style={styles.detailValue}>{cuenta.fecha_emision}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Fecha de Vencimiento:</Text>
              <Text style={styles.detailValue}>{cuenta.fecha_vencimiento}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Estado de la Cuenta:</Text>
              <Text style={[styles.detailValue, { color: isPagado ? '#34d399' : '#f87171', fontWeight: 'bold' }]}>{cuenta.estado_cuenta}</Text>
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