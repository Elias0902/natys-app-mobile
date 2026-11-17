import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { colors } from '../../../utils/theme';

export default function EntregaViewModal({ visible, entrega, onClose }) {
  if (!entrega) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle de Entrega #{entrega.id_entregas}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cliente:</Text>
              <Text style={styles.detailValue}>{entrega.cliente_nombre} ({entrega.tipo_id}-{entrega.cliente_id})</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Sector / Dirección:</Text>
              <Text style={styles.detailValue}>{entrega.sector} - {entrega.direccion}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Teléfono de Contacto:</Text>
              <Text style={styles.detailValue}>{entrega.telefono_contacto}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Camión Asignado:</Text>
              <Text style={styles.detailValue}>{entrega.camion_modelo} (Placa: {entrega.camion_placa})</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Repartidor:</Text>
              <Text style={styles.detailValue}>{entrega.repartidor}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Número de Cajas:</Text>
              <Text style={[styles.detailValue, { color: '#facc15', fontWeight: 'bold' }]}>{entrega.num_cajas} cajas</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Fechas:</Text>
              <Text style={styles.detailValue}>Programada: {entrega.fecha_programada} | Entrega: {entrega.fecha_entrega}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Estado:</Text>
              <Text style={[styles.detailValue, { color: '#4ade80', fontWeight: 'bold' }]}>{entrega.estado}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Observaciones:</Text>
              <Text style={styles.detailValue}>{entrega.observaciones || 'Ninguna'}</Text>
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
  detailItem: { marginBottom: 8 },
  detailLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', marginBottom: 2 },
  detailValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  modalCloseBtn: { backgroundColor: colors.red, marginTop: 16, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalCloseText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});