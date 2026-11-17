import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';

export default function EntregaCreateModal({ visible, onClose, onSubmit }) {
  const [form, setForm] = useState({
    id_camion: '',
    id_pedido: '',
    fecha_programada: '',
    repartidor: '',
    num_cajas: '',
    observaciones: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = () => {
    if (!form.id_camion || !form.id_pedido || !form.repartidor) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    onSubmit(form);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Programar Nueva Entrega</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID del Pedido *</Text>
              <TextInput style={styles.input} placeholder="Ej. 1" placeholderTextColor={colors.muted} value={form.id_pedido} onChangeText={(v) => handleChange('id_pedido', v)} keyboardType="numeric" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID del Camión *</Text>
              <TextInput style={styles.input} placeholder="Ej. 1" placeholderTextColor={colors.muted} value={form.id_camion} onChangeText={(v) => handleChange('id_camion', v)} keyboardType="numeric" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Repartidor *</Text>
              <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor={colors.muted} value={form.repartidor} onChangeText={(v) => handleChange('repartidor', v)} />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fecha Programada</Text>
                <TextInput style={styles.input} placeholder="AAAA-MM-DD" placeholderTextColor={colors.muted} value={form.fecha_programada} onChangeText={(v) => handleChange('fecha_programada', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Número de Cajas</Text>
                <TextInput style={styles.input} placeholder="Ej. 240" placeholderTextColor={colors.muted} value={form.num_cajas} onChangeText={(v) => handleChange('num_cajas', v)} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observaciones</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Notas de entrega..." placeholderTextColor={colors.muted} value={form.observaciones} onChangeText={(v) => handleChange('observaciones', v)} multiline />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>Guardar Entrega</Text>
            </TouchableOpacity>
          </View>
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
  modalBody: { gap: 12 },
  rowInputs: { flexDirection: 'row', gap: 10 },
  inputGroup: { gap: 4 },
  label: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 14 },
  textArea: { height: 70, textAlignVertical: 'top' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});