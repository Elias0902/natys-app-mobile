import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { colors } from '../../../utils/theme';

export default function CuentaPagarCreateModal({ visible, onClose, onSubmit }) {
  const [form, setForm] = useState({
    id_compra: '',
    id_proveedor: '',
    monto_total: '',
    saldo_pendiente: '',
    fecha_emision: '',
    fecha_vencimiento: '',
    estado_pago: 'Por Pagar',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = () => {
    if (!form.id_compra || !form.id_proveedor || !form.monto_total) {
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
            <Text style={styles.modalTitle}>Registrar Nueva Cuenta por Pagar</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>ID Compra *</Text>
                <TextInput style={styles.input} placeholder="Ej. 1" placeholderTextColor={colors.muted} value={form.id_compra} onChangeText={(v) => handleChange('id_compra', v)} keyboardType="numeric" />
              </View>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.label}>ID Proveedor *</Text>
                <TextInput style={styles.input} placeholder="Ej. 12321234" placeholderTextColor={colors.muted} value={form.id_proveedor} onChangeText={(v) => handleChange('id_proveedor', v)} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Monto Total ($) *</Text>
                <TextInput style={styles.input} placeholder="Ej. 200" placeholderTextColor={colors.muted} value={form.monto_total} onChangeText={(v) => handleChange('monto_total', v)} keyboardType="numeric" />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Saldo Pendiente ($)</Text>
                <TextInput style={styles.input} placeholder="Ej. 200" placeholderTextColor={colors.muted} value={form.saldo_pendiente} onChangeText={(v) => handleChange('saldo_pendiente', v)} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>F. Emisión</Text>
                <TextInput style={styles.input} placeholder="AAAA-MM-DD" placeholderTextColor={colors.muted} value={form.fecha_emision} onChangeText={(v) => handleChange('fecha_emision', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>F. Vencimiento</Text>
                <TextInput style={styles.input} placeholder="AAAA-MM-DD" placeholderTextColor={colors.muted} value={form.fecha_vencimiento} onChangeText={(v) => handleChange('fecha_vencimiento', v)} />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSave}>
              <Text style={styles.btnSubmitText}>Guardar Cuenta</Text>
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
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  btnCancel: { backgroundColor: '#334155', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnCancelText: { color: colors.text, fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: colors.red, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});