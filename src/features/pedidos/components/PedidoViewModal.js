import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { colors } from '../../../utils/theme';
import { money } from '../../../utils/format';

export default function PedidoViewModal({ visible, pedido, onClose }) {
  if (!pedido) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle del Pedido #{pedido.id_pedido}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cliente:</Text>
              <Text style={styles.detailValue}>{pedido.nombre_cliente} ({pedido.tipo_id}-{pedido.id_cliente})</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Teléfono de Contacto:</Text>
              <Text style={styles.detailValue}>{pedido.tlf_contacto}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Productos y Cantidades:</Text>
              <Text style={styles.detailValueProduct}>{pedido.productos} — Cantidad: {pedido.cantidades}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Monto Total:</Text>
              <Text style={[styles.detailValue, { color: '#facc15', fontWeight: 'bold' }]}>{money(pedido.monto_total_pedido)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Estado del Pago:</Text>
              <Text style={styles.detailValue}>{pedido.pago}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Estado del Pedido:</Text>
              <Text style={styles.detailValue}>{pedido.nombre_estado}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Dirección de Entrega:</Text>
              <Text style={styles.detailValue}>{pedido.direccion_entrega}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Observaciones:</Text>
              <Text style={styles.detailValue}>{pedido.observaciones || 'Ninguna'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Fecha del Pedido:</Text>
              <Text style={styles.detailValue}>{pedido.fecha_pedido}</Text>
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
  modalContent: { backgroundColor: colors.card, width: '100%', maxWidth: 500, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 18, color: colors.muted, fontWeight: 'bold' },
  modalBody: { gap: 10 },
  detailItem: { marginBottom: 8 },
  detailLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', marginBottom: 2 },
  detailValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  detailValueProduct: { fontSize: 14, color: '#facc15', fontWeight: '700', backgroundColor: 'rgba(250, 204, 21, 0.1)', padding: 8, borderRadius: 6 },
  modalCloseBtn: { backgroundColor: colors.red, marginTop: 16, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalCloseText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});