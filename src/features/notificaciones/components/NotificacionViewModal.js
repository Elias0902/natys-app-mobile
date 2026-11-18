import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { colors } from '../../../utils/theme';

export default function NotificacionViewModal({ visible, notificacion, onClose, onEdit, onMarcarLeida, onDelete }) {
  if (!notificacion) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle de Notificación #{notificacion.id_notificaciones}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <Text style={styles.detailLabel}>Título:</Text>
            <Text style={styles.detailValue}>{notificacion.titulo}</Text>

            <Text style={styles.detailLabel}>Descripción:</Text>
            <Text style={styles.detailValue}>{notificacion.descripcion_notificacion}</Text>

            <Text style={styles.detailLabel}>Fecha:</Text>
            <Text style={styles.detailValue}>{notificacion.fecha_notificacion}</Text>

            <Text style={styles.detailLabel}>Tipo / Alcance:</Text>
            <Text style={styles.detailValue}>{notificacion.tipo_notificacion} ({notificacion.alcance})</Text>

            <Text style={styles.detailLabel}>Rol Destino:</Text>
            <Text style={styles.detailValue}>{notificacion.nombre_rol}</Text>
          </ScrollView>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.btnEdit]} onPress={() => onEdit && onEdit(notificacion)}>
              <Text style={styles.actionBtnText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.btnCheck]} onPress={() => onMarcarLeida && onMarcarLeida(notificacion)}>
              <Text style={styles.actionBtnText}>Marcar como leída</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.btnDelete]} onPress={() => onDelete && onDelete(notificacion)}>
              <Text style={styles.actionBtnText}>Eliminar</Text>
            </TouchableOpacity>
          </View>

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
  detailLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', marginTop: 4 },
  detailValue: { fontSize: 14, color: colors.text, marginBottom: 4 },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  actionBtn: { flexGrow: 1, paddingVertical: 9, borderRadius: 6, alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  btnEdit: { backgroundColor: '#1d4ed8' },
  btnCheck: { backgroundColor: '#15803d' },
  btnDelete: { backgroundColor: '#b91c1c' },
  modalCloseBtn: { backgroundColor: colors.red, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalCloseText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});
