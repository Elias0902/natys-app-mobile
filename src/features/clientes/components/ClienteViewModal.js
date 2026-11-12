import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { colors } from '../../../utils/theme';
import { BASE_URL } from '../../../utils/config';

export default function ClienteViewModal({ visible, cliente, onClose }) {
  if (!cliente) return null;

  const serverRoot = BASE_URL.replace('/api', '');
  const rawImg = cliente.img_cliente || '';
  const imageUrl = rawImg ? `${serverRoot}/${rawImg.replace(/^\/+/, '')}` : null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle del Cliente</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.avatar} resizeMode="cover" />
                ) : (
                  <Text style={styles.avatarFallback}>👤</Text>
                )}
              </View>
              <Text style={styles.clientNameTitle}>{cliente.nombre_cliente}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cliente.nombre_tipo_cliente}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cédula / RIF:</Text>
              <Text style={styles.detailValue}>{cliente.tipo_id}-{cliente.id_cliente}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Teléfono:</Text>
              <Text style={styles.detailValue}>{cliente.tlf_cliente}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Correo Electrónico:</Text>
              <Text style={styles.detailValue}>{cliente.email_cliente}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Sector:</Text>
              <Text style={styles.detailValue}>{cliente.sector}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Días de Crédito:</Text>
              <Text style={[styles.detailValue, { color: '#fbbf24', fontWeight: 'bold' }]}>{cliente.dias_credito} días</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Dirección:</Text>
              <Text style={styles.detailValue}>{cliente.direccion_cliente}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Fecha de Registro:</Text>
              <Text style={styles.detailValue}>{cliente.fecha_registro}</Text>
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
  avatarWrapper: { alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16 },
  avatarContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  avatar: { width: '100%', height: '100%' },
  avatarFallback: { fontSize: 28 },
  clientNameTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  badge: { backgroundColor: colors.red, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' },
  detailItem: { marginBottom: 6 },
  detailLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', marginBottom: 2 },
  detailValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  modalCloseBtn: { backgroundColor: colors.red, marginTop: 16, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalCloseText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});